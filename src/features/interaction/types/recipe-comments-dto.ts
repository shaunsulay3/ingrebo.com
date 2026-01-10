import type { CommentDTO } from "./comment-dto";

export interface RecipeCommentsDTO {
    commentsCount: number;
    comments: CommentDTO[];
}
