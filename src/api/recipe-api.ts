import type { RecipeDTO } from "../features/recipes/types/recipe-dto";
import type { RecipeThumbnailDTO } from "../features/recipes/types/recipe-thumbnail-dto";
import type { SearchRecipeIngredientLineDTO } from "../features/recipes/types/search-recipe-ingredient-line-dto";
import { api } from "../lib/axios";
import type { SearchRecipeIngredientLineRequestDTO } from "../features/recipes/types/requests/search-recipe-ingredient-line-request-dto";
import type { CreateRecipeRequestDTO } from "../features/recipes/types/requests/create-recipe-request-dto";
import type { UserRecipes } from "../features/recipes/types/user-recipes.dto";

export const recommendRecipes = async (byMatch: boolean): Promise<RecipeThumbnailDTO[]> => {
    const byMatchParam = byMatch ? "true" : "false";
    const recipeThumbnailDTOs = await api.get<RecipeThumbnailDTO[]>(
        `/recipes/recommend?byMatch=${byMatchParam}`
    );
    return recipeThumbnailDTOs.data;
};

export const searchRecipe = async (
    query: string,
    byMatch: boolean
): Promise<RecipeThumbnailDTO[]> => {
    const recipeThumbnailDTOs = await api.get<RecipeThumbnailDTO[]>(
        `/recipes/search?byMatch=${byMatch}&query="${query}"`
    );
    return recipeThumbnailDTOs.data;
};

export const getRecipe = async (authorSlug: string, slug: string) => {
    const recipeDTO = await api.get<RecipeDTO>(`/recipes/${authorSlug}/${slug}`);
    return recipeDTO.data;
};

export const getUserRecipes = async (slug: string): Promise<UserRecipes> => {
    const recipeThumbnailDTOs = await api.get<UserRecipes>(`/recipes/${slug}`);
    return recipeThumbnailDTOs.data;
};

export const createRecipe = async ({
    recipeData,
    imageFile,
}: {
    recipeData: CreateRecipeRequestDTO;
    imageFile: File | null;
}): Promise<void> => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(recipeData));
    if (imageFile) {
        formData.append("image", imageFile);
    }
    await api.post("/recipes", formData, { headers: { "Content-Type": "multipart/form-data" } });
};

export const searchRecipeIngredientLine = async (
    request: SearchRecipeIngredientLineRequestDTO
): Promise<SearchRecipeIngredientLineDTO> => {
    const searchRecipeIngredientLineDTO = await api.post<SearchRecipeIngredientLineDTO>(
        "/recipes/ingredient-line",
        request
    );
    return searchRecipeIngredientLineDTO.data;
};

export const deleteRecipe = async (id: string): Promise<void> => {
    await api.delete(`/recipes/${id}`);
    return;
};

export const getSavedRecipes = async (): Promise<RecipeThumbnailDTO[]> => {
    const recipeThumbnails = await api.get<RecipeThumbnailDTO[]>(`/recipes/saved`);
    return recipeThumbnails.data;
};
