import type { SearchRecipeIngredientDTO } from "./search-recipe-ingredient-dto";

export interface SearchRecipeIngredientLineDTO {
    line: string;
    recipeIngredients: SearchRecipeIngredientDTO[];
}
