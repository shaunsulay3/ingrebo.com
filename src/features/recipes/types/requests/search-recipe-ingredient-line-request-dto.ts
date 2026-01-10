export interface SearchRecipeIngredientLineRequestDTO {
    line: string;
    recipeIngredients: SearchRecipeIngredientRequestDTO[];
}

export interface SearchRecipeIngredientRequestDTO {
    ingredientIndex: {
        start: number;
        end: number;
    };
    selectedVariety?: string;
    specificOption?: string;
}
