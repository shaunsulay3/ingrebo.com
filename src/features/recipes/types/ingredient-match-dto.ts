import type { IngredientDTO } from "./ingredient-dto";

export interface IngredientMatchDTO {
    ingredientToMatchName: string;
    status: IngredientMatchStatuses;
    matchingIngredients: IngredientDTO[];
}

export type IngredientMatchStatuses = "match" | "alternative" | "no-match" | "no-comparison";
