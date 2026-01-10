import type { NutrientFactsDTO } from "./nutrient-facts-dto";
import type { RecipeIngredientLineDTO } from "./recipe-ingredient-line-dto";
import type { RecipeInteractionsDTO } from "./recipe-interactions-dto";

export interface RecipeDTO {
    id: string;
    name: string;
    author: string;
    userIsAuthor: boolean;
    createdOn: string;
    updatedOn: string;
    prepTime: number;
    cookTime: number;
    totalTime: number;
    servings: number;
    description: string;
    preparation: string[];
    recipeIngredientLines: RecipeIngredientLineDTO[];
    interactions: RecipeInteractionsDTO;
    imageUrl: string | null;
    nutrientFacts: NutrientFactsDTO;
    hasCompleteNutrientInfo: boolean;
}
