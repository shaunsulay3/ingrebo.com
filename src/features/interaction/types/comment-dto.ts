export interface CommentDTO {
    id: string;
    likes: number;
    isLiked: boolean;
    username: string;
    content: string;
    createdOn: Date;
    replies: CommentDTO[];
}
