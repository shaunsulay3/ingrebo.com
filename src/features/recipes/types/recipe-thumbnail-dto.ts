import type { IngredientMatchDTO } from "./ingredient-match-dto";
import type { RecipeInteractionsDTO } from "./recipe-interactions-dto";

export interface RecipeThumbnailDTO {
    id: string;
    name: string;
    author: string;
    authorSlug: string;
    slug: string;
    createdOn: Date;
    prepTime: number;
    cookTime: number;
    totalTime: number;
    servings: number;
    ingredientMatches: IngredientMatchDTO[];
    matchScore: number | null;
    interactions: RecipeInteractionsDTO;
    imageUrl: string | null;
    hasCompleteNutrientInfo: boolean;
}
