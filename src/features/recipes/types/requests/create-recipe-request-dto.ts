export interface CreateRecipeRequestDTO {
    id: string | undefined;
    name: string;
    cookTime: number;
    prepTime: number;
    servings: number;
    description: string;
    preparation: string[];
    recipeIngredientLines: RecipeIngredientLineRequestDTO[];
}
export interface RecipeIngredientLineRequestDTO {
    line: string;
    recipeIngredients: RecipeIngredientRequestDTO[];
}
export interface RecipeIngredientRequestDTO {
    ingredientIndex: {
        start: number;
        end: number;
    };
    selectedVariety: string;
    specificOption?: string;
}
