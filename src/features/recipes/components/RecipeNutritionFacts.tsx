import type { NutrientFactsDTO } from "../types/nutrient-facts-dto";
import type { FactFieldDTO } from "../types/nutrient-facts-dto";

type RecipeNutritionFactsProps = {
    nutrientFactsDTO: NutrientFactsDTO;
};

export default function RecipeNutritionFacts({ nutrientFactsDTO }: RecipeNutritionFactsProps) {
    const displayFactField = (factFieldDTO: FactFieldDTO | null): string => {
        if (!factFieldDTO) {
            return "N/A";
        }
        return `${factFieldDTO.amount}${factFieldDTO.unit}`;
    };
    function Nutrient({
        name,
        factFieldDTO,
        isSubfield = false,
    }: {
        name: string;
        factFieldDTO: FactFieldDTO | null;
        isSubfield?: boolean;
    }) {
        if (isSubfield) {
            return (
                <span className="ml-6 text-sm">
                    {name + " "}
                    {displayFactField(factFieldDTO)}
                </span>
            );
        }
        return (
            <span>
                <b className="mr-3">{name}</b>
                {displayFactField(factFieldDTO)}
            </span>
        );
    }
    return (
        <div className="flex flex-col border-2 border-gray-100 rounded-2xl px-8 py-4">
            <span className="!mb-0 font-extrabold text-2xl">Nutrition Facts</span>
            <span className="text-xs">
                Serving Size: {displayFactField(nutrientFactsDTO.servingSize)}
            </span>
            <div className="h-1.5 bg-gray-200 mt-1 mb-1" />
            <Nutrient name="Calories" factFieldDTO={nutrientFactsDTO.calories} />
            <Nutrient name="Total Fat" factFieldDTO={nutrientFactsDTO.totalFat} />
            <Nutrient
                name="Saturated Fat"
                factFieldDTO={nutrientFactsDTO.saturatedFat}
                isSubfield={true}
            />
            <Nutrient name="Trans Fat" factFieldDTO={nutrientFactsDTO.transFat} isSubfield={true} />
            <Nutrient name="Cholesterol" factFieldDTO={nutrientFactsDTO.cholesterol} />
            <Nutrient name="Sodium" factFieldDTO={nutrientFactsDTO.sodium} />
            <Nutrient name="Potassium" factFieldDTO={nutrientFactsDTO.potassium} />
            <Nutrient name="Total Carbohydrate" factFieldDTO={nutrientFactsDTO.totalCarbohydrate} />
            <Nutrient
                name="Dietary Fiber"
                factFieldDTO={nutrientFactsDTO.dietaryFiber}
                isSubfield={true}
            />
            <Nutrient
                name="Total Sugars"
                factFieldDTO={nutrientFactsDTO.totalSugars}
                isSubfield={true}
            />
            <Nutrient name="Protein" factFieldDTO={nutrientFactsDTO.protein} />
        </div>
    );
}
