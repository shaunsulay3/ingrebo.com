import { Link } from "react-router-dom";
import type { RecipeThumbnailDTO } from "../types/recipe-thumbnail-dto";
import IngredientMatchPreview from "./IngredientMatchPreview";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck } from "lucide-react";
import React from "react";
type RecipeThumbnailProps = {
    recipeThumbnail: RecipeThumbnailDTO;
};

function RecipeThumbnail({ recipeThumbnail }: RecipeThumbnailProps) {
    const recipeUrl = `/${recipeThumbnail.authorSlug}/${recipeThumbnail.slug}`;
    const [hasAllMatchingIngredients, setHasAllMatchingIngredients] = useState<boolean>(false);
    useEffect(() => {
        let matchesCompletely: boolean = true;
        for (const match of recipeThumbnail.ingredientMatches) {
            if (match.status === "no-comparison" || match.status === "no-match") {
                matchesCompletely = false;
            }
        }
        if (matchesCompletely) {
            setHasAllMatchingIngredients(true);
        }
    }, [recipeThumbnail.ingredientMatches]);
    return (
        <div
            className={`${
                hasAllMatchingIngredients ? "border-green-800" : "border-gray-200"
            } max-w-full px-[3%] h-fit rounded-2xl border-2 pt-3 hover:bg-gray-50 duration-100`}
        >
            <div className="flex mb-2 px-1">
                <div className="min-w-[72%] pr-2 overflow-auto">
                    <Link to={recipeUrl}>
                        <h3 className="!m-0">{recipeThumbnail.name}</h3>
                    </Link>
                </div>
                <div className="flex flex-col justify-start w-full truncate pt-1">
                    <Link to={`/${recipeThumbnail.authorSlug}`}>
                        <p className="!m-0 truncate text-right hover:text-green-900">
                            {recipeThumbnail.author}
                        </p>
                    </Link>
                </div>
            </div>
            {recipeThumbnail.imageUrl && (
                <Link to={recipeUrl}>
                    <img
                        src={recipeThumbnail.imageUrl}
                        className="object-cover rounded-2xl aspect-4/3"
                    />
                </Link>
            )}

            <div className="flex items-center justify-between">
                <IngredientMatchPreviewContainer className="py-2 gap-2 w-fit">
                    {recipeThumbnail.ingredientMatches.map((match) => (
                        <IngredientMatchPreview ingredientMatchDTO={match} />
                    ))}
                </IngredientMatchPreviewContainer>
                {recipeThumbnail.hasCompleteNutrientInfo && (
                    <div className="relative group">
                        <BadgeCheck className="text-green-800 cursor-help" />
                        <div className="shadow-2xl absolute top-1/2 left-full -translate-y-1/2 ml-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity delay-100 z-50 border-2 border-green-800 bg-white w-30 rounded-2xl p-2 text-center text-sm text-green-800">
                            <i>Nutrition Facts available!</i>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecipeThumbnail;

function IngredientMatchPreviewContainer({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState<number>(React.Children.count(children));

    useEffect(() => {
        const measureContainer = measureRef.current;
        const displayContainer = containerRef.current;
        if (!measureContainer || !displayContainer) return;

        const recalc = () => {
            const childElements = Array.from(measureContainer.children) as HTMLElement[];
            const parentWidth =
                displayContainer.parentElement?.getBoundingClientRect().width ??
                displayContainer.getBoundingClientRect().width;

            let total = 0;
            let count = 0;
            for (const child of childElements) {
                total += child.getBoundingClientRect().width;
                if (total > 0.8 * parentWidth) break;
                count++;
            }
            setVisibleCount(count);
        };

        // Wait for images to load before first calc
        const imgs = Array.from(measureContainer.querySelectorAll("img"));
        let pending = imgs.length;
        const tryRecalc = () => {
            if (--pending <= 0) recalc();
        };
        if (pending === 0) recalc();
        else
            imgs.forEach((img) => {
                if (img.complete) tryRecalc();
                else img.addEventListener("load", tryRecalc, { once: true });
            });

        const ro = new ResizeObserver(recalc);
        ro.observe(displayContainer);
        if (displayContainer.parentElement) ro.observe(displayContainer.parentElement);
        window.addEventListener("resize", recalc);

        return () => {
            ro.disconnect();
            window.removeEventListener("resize", recalc);
        };
    }, [children]);

    const childArray = React.Children.toArray(children);

    return (
        <>
            {/* Visible content */}
            <div ref={containerRef} className={`${className} flex overflow-hidden`}>
                {childArray.slice(0, visibleCount)}
            </div>

            {/* Hidden measurement container (invisible but still in DOM for measuring) */}
            <div
                ref={measureRef}
                className="flex absolute invisible pointer-events-none opacity-0"
                style={{ height: 0 }}
            >
                {childArray}
            </div>
        </>
    );
}
