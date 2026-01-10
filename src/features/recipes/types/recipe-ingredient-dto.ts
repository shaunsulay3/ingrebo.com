import type { AmountDTO } from "./amount-dto";
import type { IngredientDTO } from "./ingredient-dto";
import type { IngredientIndexDTO } from "./ingredient-index-dto";
import type { IngredientMatchDTO } from "./ingredient-match-dto";
import type { NutrientFactsDTO } from "./nutrient-facts-dto";

export interface RecipeIngredientDTO {
    ingredientMatch: IngredientMatchDTO;
    ingredientIndex: IngredientIndexDTO;
    ingredient: IngredientDTO;
    amounts: AmountDTO[];
    specificOption: string | null;
    nutrientFacts: NutrientFactsDTO | null;
}
