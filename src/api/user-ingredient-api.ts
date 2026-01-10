import { api } from "../lib/axios";
import type { UserIngredientDTO } from "../features/user-ingredients/types/user-ingredient-dto";
import type { UserIngredientCategoryDTO } from "../features/user-ingredients/types/user-ingredient-category-dto";

export const searchIngredient = async (ingredientName: string): Promise<UserIngredientDTO> => {
    const searchIngredientDTO = await api.get<UserIngredientDTO>(
        `/user-ingredients/search?name=${ingredientName}`
    );
    return searchIngredientDTO.data;
};

export const saveIngredients = async (
    ingredients: { name: string; selectedVarietyName: string }[]
): Promise<void> => {
    await api.post(
        `/user-ingredients`,
        ingredients.map((ingredient) => {
            return {
                name: ingredient.name,
                selectedVarietyName: ingredient.selectedVarietyName,
            };
        })
    );
};

export const getUserIngredientsCategorized = async (): Promise<UserIngredientCategoryDTO[]> => {
    const response = await api.get<UserIngredientCategoryDTO[]>(`/user-ingredients/categorized`);
    return response.data;
};

export const deleteUserIngredient = async (id: string): Promise<void> => {
    await api.delete(`/user-ingredients/${id}`);
    return;
};

export const updateUserIngredient = async (
    id: string,
    selectedVarietyName: string
): Promise<void> => {
    await api.patch(`/user-ingredients/${id}`, {
        selectedVarietyName: selectedVarietyName,
    });
    return;
};
