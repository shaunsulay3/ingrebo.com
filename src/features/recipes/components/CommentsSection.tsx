import { useAuth } from "../../../contexts/AuthContext";
import TextAreaBox from "../../../components/TextAreaBox";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createComment,
    getRecipeComments,
    likeComment,
    unlikeComment,
} from "../../../api/interaction-api";
import type { CommentDTO } from "../../interaction/types/comment-dto";
import { Heart } from "lucide-react";

export default function CommentsSection({ recipeId }: { recipeId: string }) {
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuth();
    const [commentInput, setCommentInput] = useState("");
    const { isFetching, data } = useQuery({
        queryKey: ["comments", recipeId],
        queryFn: () => getRecipeComments(recipeId),
        refetchOnWindowFocus: false,
    });
    const createCommentMutation = useMutation({
        mutationFn: (content: string) => createComment(recipeId, content, null),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", recipeId] });
            setCommentInput("");
        },
    });
    return (
        <div>
            <h2 className="!m-0">Comments</h2>
            {isAuthenticated ? (
                <div className="mt-2">
                    <TextAreaBox
                        onChange={(value) => {
                            setCommentInput(value);
                        }}
                        className="border-gray-200"
                        placeholder="Add a comment.."
                        value={commentInput}
                    />
                    <div className="flex justify-end mt-2">
                        <div
                            className={`${
                                commentInput.trim() !== ""
                                    ? "border-green-800 text-sm text-green-800 cursor-pointer hover:bg-green-800 hover:text-white transition-colors"
                                    : " border-gray-100 bg-gray-100 text-gray-500"
                            }  border-2 rounded-xl px-2 py-1 `}
                            onClick={() => {
                                if (commentInput.trim() === "") {
                                    return;
                                }
                                createCommentMutation.mutate(commentInput.trim());
                            }}
                        >
                            Comment
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <i>
                        <Link to="/login">
                            <span className="text-green-700">Login</span>
                        </Link>{" "}
                        <span className="text-gray-500"> so you can comment on this recipe..</span>
                    </i>
                </div>
            )}
            {isFetching ? (
                <div>Loading...</div>
            ) : !data ? (
                <div>Error getting recipes</div>
            ) : data.comments.length === 0 ? (
                <div className="text-center text-gray-500">
                    <i>No commments yet. Be the first to give your feedback!</i>
                </div>
            ) : (
                <div>
                    {data.comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            commentDTO={comment}
                            initialReplySpacing={40}
                            recipeId={recipeId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function Comment({
    commentDTO,
    initialReplySpacing,
    recipeId,
}: {
    commentDTO: CommentDTO;
    recipeId: string;
    initialReplySpacing: number;
}) {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    const [isLiked, setIsLiked] = useState(commentDTO.isLiked);
    const [likeCount, setLikeCount] = useState<number>(commentDTO.likes);
    const [replyBoxIsOpen, setReplyBoxIsOpen] = useState(false);
    const [replyInput, setReplyInput] = useState<string>("");
    const createCommentMutation = useMutation({
        mutationFn: (content: string) => createComment(recipeId, content, commentDTO.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", recipeId] });
            setReplyInput("");
        },
    });
    const handleClickLiked = async () => {
        const like = !isLiked;
        setIsLiked((prev) => !prev);
        setLikeCount((prev) => {
            if (prev === undefined) {
                return prev;
            }
            return like ? prev + 1 : prev - 1;
        });
        try {
            if (!isLiked) {
                await likeComment(commentDTO.id);
                return;
            }
            await unlikeComment(commentDTO.id);
            return;
        } catch (error) {
            setIsLiked((prev) => !prev);
            setLikeCount((prev) => {
                if (prev === undefined) {
                    return prev;
                }
                return like ? prev - 1 : prev + 1;
            });
        }
    };
    return (
        <div>
            <div key={commentDTO.id} className="mb-4">
                <div className="flex items-baseline gap-2">
                    <div className="font-bold">{commentDTO.username}</div>
                    <div className="text-gray-400 text-sm">
                        {timeAgo(new Date(commentDTO.createdOn))}
                    </div>
                </div>

                <div>{commentDTO.content}</div>
                <div className="flex items-center mt-1">
                    <Heart
                        size={"1rem"}
                        className={`${isLiked ? "fill-red-500 text-red-500" : ""}`}
                        onClick={handleClickLiked}
                    />
                    <div className="ml-2 text-sm">{likeCount}</div>
                    {!replyBoxIsOpen && (
                        <button
                            className="ml-4 text-sm font-semibold rounded-2xl hover:bg-gray-100 px-2 py-1 cursor-pointer"
                            onClick={() => setReplyBoxIsOpen(true)}
                        >
                            Reply
                        </button>
                    )}
                </div>
                {replyBoxIsOpen && (
                    <div className="mt-2">
                        {isAuthenticated ? (
                            <div>
                                <TextAreaBox
                                    onChange={(value) => {
                                        setReplyInput(value);
                                    }}
                                />
                                <div className="flex justify-end">
                                    <button
                                        className={`${
                                            replyInput.trim() === ""
                                                ? "text-gray-400 "
                                                : "hover:bg-gray-100 cursor-pointer"
                                        } ml-2 text-sm font-semibold rounded-2xl px-2 py-1 `}
                                        onClick={() => {
                                            createCommentMutation.mutate(replyInput.trim());
                                        }}
                                    >
                                        Reply
                                    </button>
                                    <button
                                        className="ml-4 text-sm font-semibold rounded-2xl hover:bg-gray-100 px-2 py-1 cursor-pointer"
                                        onClick={() => {
                                            setReplyBoxIsOpen(false);
                                            setReplyInput("");
                                        }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <i>
                                    <Link to="/login">
                                        <span className="text-green-700">Login</span>
                                    </Link>{" "}
                                    <span className="text-gray-500">
                                        {" "}
                                        so you can reply to this comment..
                                    </span>
                                </i>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ marginLeft: initialReplySpacing }}>
                {commentDTO.replies.map((replyDTO) => (
                    <Comment
                        key={replyDTO.id}
                        commentDTO={replyDTO}
                        initialReplySpacing={initialReplySpacing}
                        recipeId={recipeId}
                    />
                ))}
            </div>
        </div>
    );
}

function timeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    const units: [number, Intl.RelativeTimeFormatUnit][] = [
        [60, "second"],
        [60, "minute"],
        [24, "hour"],
        [30, "day"],
        [12, "month"],
    ];

    let unit: Intl.RelativeTimeFormatUnit = "year";
    let value = seconds;

    for (const [divisor, nextUnit] of units) {
        if (Math.abs(value) < divisor) {
            unit = nextUnit;
            break;
        }
        value /= divisor;
        unit = nextUnit;
    }

    return rtf.format(-Math.floor(value), unit);
}
