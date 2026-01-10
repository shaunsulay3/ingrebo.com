import type { AmountDTO } from "./amount-dto";
import type { IngredientDTO } from "./ingredient-dto";
import type { IngredientIndexDTO } from "./ingredient-index-dto";
import type { NutrientFactsDTO } from "./nutrient-facts-dto";
import type { VarietyDTO } from "./variety-dto";

export interface SearchRecipeIngredientDTO {
    ingredientIndex: IngredientIndexDTO;
    ingredient: IngredientDTO;
    amounts: AmountDTO[];
    possibleUnits: string[];
    specificOption: string | null;
    nutrientFacts: NutrientFactsDTO | null;
    varieties: VarietyDTO[];
    options: string[];
    weightInGrams: number | null;
    hasValidUnit: boolean;
}
