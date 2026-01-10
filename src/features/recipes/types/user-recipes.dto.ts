import type { RecipeThumbnailDTO } from "./recipe-thumbnail-dto";

export interface UserRecipes {
    username: string;
    recipeThumbnails: RecipeThumbnailDTO[];
}
