import { useEffect, useState } from "react";
import type { RecipeIngredientDTO } from "../types/recipe-ingredient-dto";
import { v4 as uuid } from "uuid";

type RecipeIngredientProps = {
    recipeIngredientDTO: RecipeIngredientDTO;
    name: string;
    openRecipeIngredientId: string;
    isAuthenticated: boolean;
    onToggleOpen: (id: string) => void;
};

export default function RecipeIngredient({
    recipeIngredientDTO,
    name,
    openRecipeIngredientId,
    isAuthenticated,
    onToggleOpen,
}: RecipeIngredientProps) {
    const [colorStyle, setColorStyle] = useState<string>("");
    const [popupStyle, setPopupStyle] = useState<string>("");
    const [id] = useState<string>(uuid());
    const [isOpen, setIsOpen] = useState<boolean>(false);
    useEffect(() => {
        const status = recipeIngredientDTO.ingredientMatch.status;
        switch (status) {
            case "match":
                setColorStyle("bg-green-300");
                setPopupStyle("border-green-800");
                break;
            case "alternative":
                setColorStyle("bg-yellow-200");
                setPopupStyle("border-yellow-400");
                break;
            case "no-match":
                setColorStyle("bg-red-300");
                setPopupStyle("border-red-500");
                break;
            default:
                setColorStyle("bg-gray-100");
        }
    }, []);
    useEffect(() => {
        if (openRecipeIngredientId === id) {
            setIsOpen(true);
            return;
        }
        setIsOpen(false);
    }, [openRecipeIngredientId]);

    return (
        <span
            className={`${colorStyle} px-1 relative cursor-pointer`}
            onClick={(e) => {
                e.stopPropagation();
                onToggleOpen(id);
            }}
        >
            {name}
            {isOpen && (
                <div className="absolute top-1/2 left-full -translate-y-1/2 ml-2 z-50 cursor-default flex flex-col gap-2">
                    <div className="border-2 border-gray-200 rounded-2xl px-4 py-2 min-w-70 bg-white">
                        <h4 className="!m-0">{recipeIngredientDTO.specificOption}</h4>
                        <p className="!m-0 text-sm">
                            <i>{recipeIngredientDTO.ingredient.selectedVariety.category}</i>
                        </p>
                    </div>
                    <div className="border-2 border-gray-200 rounded-2xl px-4 py-2 w-fit bg-white">
                        {recipeIngredientDTO.amounts.map((amount, index) => {
                            return (
                                <p className="!m-0 text-base">
                                    {index === 0 ? "Amount: " : ""}
                                    {amount.quantity}
                                    {amount.quantityMax !== amount.quantity
                                        ? `-${amount.quantityMax}`
                                        : ""}{" "}
                                    {amount.unit}
                                </p>
                            );
                        })}
                    </div>
                    <div
                        className={`border-2 border-gray-200 rounded-2xl px-4 py-2 w-fit bg-white ${popupStyle}`}
                    >
                        {recipeIngredientDTO.ingredientMatch.status !== "no-comparison" &&
                        recipeIngredientDTO.ingredientMatch.status !== "no-match" ? (
                            recipeIngredientDTO.ingredientMatch.matchingIngredients.map(
                                (ingredient, index) => {
                                    const ingredientMatch = recipeIngredientDTO.ingredientMatch;
                                    return (
                                        <p className="!m-0 text-base">
                                            {index === 0 &&
                                                (ingredientMatch.status === "alternative"
                                                    ? "You have alternative: "
                                                    : "You have: ")}
                                            {ingredient.selectedVariety.name}
                                        </p>
                                    );
                                }
                            )
                        ) : recipeIngredientDTO.ingredientMatch.status === "no-match" ? (
                            <p className="!m-0 text-base">You don't have this ingredient.</p>
                        ) : !isAuthenticated ? (
                            <p className="!m-0 text-base">
                                <i>
                                    Login or create an account to see whether this ingredient has a
                                    match in your kitchen!
                                </i>
                            </p>
                        ) : (
                            <p className="!m-0 text-base">
                                <i>
                                    Looks like you don't have any ingredients in your kitchen yet.
                                </i>
                            </p>
                        )}
                    </div>
                </div>
            )}
        </span>
    );
}
