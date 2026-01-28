import { useEffect, useState } from "react";
import type { IngredientIndex } from "./RecipeIngredientLineInputArea";
import { BadgeCheck, Check, Circle, CircleEllipsis, Search, X } from "lucide-react";

type colors = "green" | "lightGreen" | "red" | "gray" | "lightGray" | "white";

type LineColorStatusProps = {
    queryStatus: string;
    line: string;
    inLineIngredientIndices: IngredientIndex[];
};

function LineColorStatus({ queryStatus, line, inLineIngredientIndices }: LineColorStatusProps) {
    const [colorStatus, setColorStatus] = useState<colors>("white");
    const [className, setClassName] = useState<string>("");
    useEffect(() => {
        const color = getLineColorStatus(queryStatus, line, inLineIngredientIndices);
        setColorStatus(color);
        switch (color) {
            case "green":
                setClassName("bg-green-500 border-green-500 group-hover:bg-white");
                break;
            case "lightGreen":
                setClassName("bg-green-300 border-green-300 group-hover:bg-white");
                break;
            case "red":
                setClassName("bg-red-300 border-red-300 group-hover:bg-white");
                break;
            case "gray":
                setClassName("bg-gray-700 border-gray-700 group-hover:bg-white");
                break;
            case "lightGray":
                setClassName("bg-gray-300 border-gray-300 group-hover:bg-white");
                break;
            case "white":
                setClassName("border-white");
                break;
        }
    }, [queryStatus, line, inLineIngredientIndices]);

    return (
        <div className=" w-full flex items-center justify-center relative group ">
            {colorStatus === "green" ? (
                <BadgeCheck className="text-green-800 w-5" />
            ) : colorStatus === "gray" ? (
                <Search className="text-gray-600 w-3" />
            ) : colorStatus === "lightGreen" ? (
                <Check className="text-green-600 w-3" />
            ) : colorStatus === "lightGray" ? (
                <CircleEllipsis className="text-gray-400 w-3" />
            ) : colorStatus === "red" ? (
                <X className="text-red-600 w-3" />
            ) : (
                <div className={`${className} border-2  w-2 h-2 rounded-full`}></div>
            )}

            {colorStatus !== "white" && (
                <div className="shadow-2xl absolute top-1/2 left-full -translate-y-1/2 ml-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity delay-100 z-50 border-2 border-gray-100 bg-white rounded-2xl">
                    <div className="p-2 text-sm text-center min-w-60">
                        {colorStatus === "green" && (
                            <div>Ingredients recognized with Nutritional Data!</div>
                        )}
                        {colorStatus === "lightGreen" && (
                            <div>
                                Ingredients recognized. To get nutritional data, specify specific
                                option and amount with valid units
                            </div>
                        )}
                        {colorStatus === "red" && <div>Some ingredients could not be found.</div>}
                        {colorStatus === "gray" && <div>Searching ingredients...</div>}
                        {colorStatus === "lightGray" && (
                            <div>No ingredients recognized in this line.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
function getLineColorStatus(
    queryStatus: string,
    line: string,
    inLineIngredientIndices: IngredientIndex[]
): colors {
    if (queryStatus === "loading") {
        return "gray";
    }
    if (line === "" || line === undefined) {
        return "white";
    }
    if (inLineIngredientIndices.length === 0) {
        return "lightGray";
    }
    let lowestColor: colors = "green";
    inLineIngredientIndices.forEach((ingIdx) => {
        if (
            ingIdx.searchRecipeIngredientDTO === null ||
            ingIdx.searchRecipeIngredientDTO === undefined
        ) {
            lowestColor = "red";
        } else if (ingIdx.searchRecipeIngredientDTO.weightInGrams === null) {
            if (lowestColor !== "red") {
                lowestColor = "lightGreen";
            }
        } else {
            lowestColor = "green";
        }
    });
    return lowestColor;
}
export default LineColorStatus;
