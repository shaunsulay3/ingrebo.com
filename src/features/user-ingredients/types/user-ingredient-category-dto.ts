import type { UserIngredientDTO } from "./user-ingredient-dto";

export interface UserIngredientCategoryDTO {
    category: string;
    userIngredients: UserIngredientDTO[];
}
