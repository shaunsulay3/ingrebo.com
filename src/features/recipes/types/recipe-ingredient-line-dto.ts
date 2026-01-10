import type { RecipeIngredientDTO } from "./recipe-ingredient-dto";

export interface RecipeIngredientLineDTO {
    line: string;
    recipeIngredients: RecipeIngredientDTO[];
}
