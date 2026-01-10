import type { RecipeCommentsDTO } from "../features/interaction/types/recipe-comments-dto";
import { api } from "../lib/axios";

export const likeRecipe = async (id: string) => {
    await api.post(`/interaction/like-recipe/${id}`);
};

export const unlikeRecipe = async (id: string) => {
    await api.post(`/interaction/unlike-recipe/${id}`);
};

export const saveRecipe = async (id: string) => {
    await api.post(`/interaction/save-recipe/${id}`);
};

export const unsaveRecipe = async (id: string) => {
    await api.post(`/interaction/unsave-recipe/${id}`);
};

export const getRecipeComments = async (recipeId: string): Promise<RecipeCommentsDTO> => {
    const recipeComments = await api.get(`/interaction/comments/${recipeId}`);
    return recipeComments.data;
};

export const likeComment = async (commentId: string) => {
    await api.post(`/interaction/like-comment/${commentId}`);
};
export const unlikeComment = async (commentId: string) => {
    await api.post(`/interaction/unlike-comment/${commentId}`);
};
export const createComment = async (
    recipeId: string,
    content: string,
    parentId: string | null
): Promise<void> => {
    await api.post(`/interaction/comments/${recipeId}${parentId ? `/${parentId}` : ""}`, {
        content: content,
    });
};
