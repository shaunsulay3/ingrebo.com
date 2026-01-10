import { useEffect, useState } from "react";
import type { IngredientMatchDTO } from "../types/ingredient-match-dto";

type IngredientMatchPreviewProps = {
    ingredientMatchDTO: IngredientMatchDTO;
};

export default function IngredientMatchPreview({
    ingredientMatchDTO,
}: IngredientMatchPreviewProps) {
    const [className, setClassName] = useState("");
    useEffect(() => {
        switch (ingredientMatchDTO.status) {
            case "match":
                setClassName("border-green-700 text-green-700");
                break;
            case "alternative":
                setClassName("border-yellow-500 text-yellow-500");
                break;
            case "no-match":
                setClassName("border-red-500 text-red-500");
                break;
            default:
                setClassName("border-gray-300 text-gray-700");
        }
    }, []);
    return (
        <div className={`${className} border-1 rounded-2xl px-2 py-0.5 text-xs `}>
            <div className="whitespace-nowrap">{ingredientMatchDTO.ingredientToMatchName}</div>
        </div>
    );
}
