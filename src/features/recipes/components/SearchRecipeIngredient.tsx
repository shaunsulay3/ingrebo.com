import { useState } from "react";
import type { SearchRecipeIngredientDTO } from "../types/search-recipe-ingredient-dto";

type SearchRecipeIngredientProps = {
    selectedVarietyName: string | undefined;
    setSelectedVarietyName: (name: string) => void;
    specificOptionDescription: string | undefined;
    setSpecificOptionDescription: (description: string) => void;
    searchRecipeIngredientDTO: SearchRecipeIngredientDTO;
};
type SelectorModes = "variety" | "option" | null;
function SearchRecipeIngredient({
    selectedVarietyName,
    setSelectedVarietyName,
    specificOptionDescription,
    setSpecificOptionDescription,
    searchRecipeIngredientDTO,
}: SearchRecipeIngredientProps) {
    const [windowMode, setWindowMode] = useState<SelectorModes>(null);
    const { amounts, varieties, options, weightInGrams, hasValidUnit } = searchRecipeIngredientDTO;

    const warningBgColor = "bg-yellow-100";

    return (
        <div
            className={"min-w-100 w-auto bg-white rounded-xl border-2 border-gray-200"}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="px-2 pt-2 flex items-center text-2xl gap-4">
                <b>{selectedVarietyName}</b>
                {windowMode === null && (
                    <div
                        className="text-sm rounded-xl text-center px-2 border-gray-200 text-gray-600 border-2 cursor-pointer hover:bg-gray-400 hover:border-gray-400 hover:text-white"
                        onClick={() => setWindowMode("variety")}
                    >
                        change variety
                    </div>
                )}
            </div>
            {windowMode === "variety" && (
                <div className="pl-2 max-h-[50vh] mb-4 overflow-scroll">
                    <div>Select a variety:</div>
                    {varieties.map((variety, index) => {
                        const bgColor = index % 2 === 0 ? "bg-white-0" : "bg-gray-200";
                        return (
                            <div
                                key={"variety" + variety.name + index}
                                className={`pl-2 flex items-center ${bgColor} hover:bg-gray-400 transition-colors duration-150`}
                                onClick={() => {
                                    setWindowMode(null);
                                    setSelectedVarietyName(variety.name);
                                }}
                            >
                                <div className="min-w-70">{variety.name}</div>
                                <div className="w-full pr-2 text-xs text-right">
                                    <i>{variety.category}</i>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            {windowMode === "option" && (
                <div className="pl-2 mb-5">
                    <div>Select a specific option:</div>
                    {options.map((option, index) => {
                        const bgColor = index % 2 === 0 ? "bg-white-0" : "bg-gray-200";
                        return (
                            <div
                                key={"option" + option + index}
                                className={`pl-2 flex items-center ${bgColor} hover:bg-gray-400 transition-colors duration-150`}
                                onClick={() => {
                                    setWindowMode(null);
                                    setSpecificOptionDescription(option);
                                }}
                            >
                                <div className="min-w-70">{option}</div>
                            </div>
                        );
                    })}
                </div>
            )}
            {windowMode === null && (
                <div>
                    <div className="px-2 flex items-center duration-150 gap-4">
                        {specificOptionDescription
                            ? specificOptionDescription
                            : "Select a specific option"}
                        <div
                            className="text-sm text-center rounded-xl px-2 border-gray-200 text-gray-600 border-2 cursor-pointer hover:bg-gray-400 hover:border-gray-400 hover:text-white"
                            onClick={() => setWindowMode("option")}
                        >
                            change option
                        </div>
                    </div>
                    {!specificOptionDescription && (
                        <div className={`pl-2 mt-2 mb-5 ${warningBgColor}`}>
                            This variety of ingredient has multiple records of nutritional data. To
                            get nutritional information, select a specific option.
                        </div>
                    )}
                </div>
            )}
            {specificOptionDescription && windowMode === null && (
                <div>
                    {amounts.length === 0 && (
                        <div
                            className={`pl-2 mt-2 mb-5 ${warningBgColor} overflow-y-auto overflow-x-hidden max-h-70 sc`}
                        >
                            <div>
                                This line has no amounts. To get nutritional information try
                                specifying an amount.
                            </div>
                            <div>
                                <i>ex: 3 cloves of garlic</i>
                            </div>
                            <div className="mt-4">Try using these units:</div>
                            <div className="pl-8">
                                <i>
                                    {searchRecipeIngredientDTO.possibleUnits
                                        .filter((unit) => unit.length < 20)
                                        .join(", ")
                                        .concat(", grams")}
                                </i>
                            </div>
                        </div>
                    )}
                    {amounts.length > 0 && (
                        <div className="mb-5 mt-2">
                            {!weightInGrams && (
                                <div className={`${warningBgColor}`}>
                                    <div className="pl-4">
                                        This line has no valid specified unit. To get nutritional
                                        information try specifying with these units:
                                    </div>
                                    <div className="pl-8">
                                        <i>
                                            {searchRecipeIngredientDTO.possibleUnits
                                                .filter((unit) => unit.length < 20)
                                                .concat("grams, lbs, ounce")
                                                .join(", ")}
                                        </i>
                                    </div>
                                </div>
                            )}
                            <div className="pl-2 mt-2 font-size">
                                <b>Amounts:</b>
                            </div>
                            {searchRecipeIngredientDTO.amounts.map((amount, index) => {
                                return (
                                    <div
                                        key={`amount-${index}`}
                                        className="flex flex-col gap-0 pl-4"
                                    >
                                        <div className="flex">
                                            <div className="min-w-20 pl-2">
                                                <i>Quantity:</i>
                                            </div>
                                            <div className="pl-2">
                                                {amount.quantity +
                                                    (amount.quantityMax !== amount.quantity
                                                        ? " - " + amount.quantityMax
                                                        : "")}
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="min-w-20 pl-2">
                                                <i>Unit:</i>
                                            </div>
                                            <div className="pl-2">
                                                {amount.unit ? amount.unit : "N/A"}
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div className="min-w-20 pl-2">
                                                <i>Total Weight (grams):</i>
                                            </div>
                                            <div className="pl-2">
                                                {weightInGrams ? weightInGrams : "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchRecipeIngredient;
