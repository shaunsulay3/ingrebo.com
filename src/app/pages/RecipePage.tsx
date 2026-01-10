import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipe } from "../../api/recipe-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import RecipeIngredientLine from "../../features/recipes/components/RecipeIngredientLine";
import { likeRecipe, saveRecipe, unlikeRecipe, unsaveRecipe } from "../../api/interaction-api";
import { useAuth } from "../../contexts/AuthContext";
import RecipeMacroNutrients from "../../features/recipes/components/RecipeMacroNutrients";
import RecipeNutritionFacts from "../../features/recipes/components/RecipeNutritionFacts";
import { BadgeCheck, Bookmark, Heart, MessageCircle } from "lucide-react";
import CommentsSection from "../../features/recipes/components/CommentsSection";
import { AxiosError } from "axios";
import ErrorPage from "./ErrorPage";

function RecipePage() {
    const navigate = useNavigate();
    const { authorslug, slug } = useParams();
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likeCount, setLikeCount] = useState<number | undefined>(undefined);
    const [saveCount, setSaveCount] = useState<number | undefined>(undefined);
    const [showModal, setShowModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openRecipeIngredientId, setOpenRecipeIngredientId] = useState<string>("");
    const { isAuthenticated, user } = useAuth();
    const { isFetching, data, error } = useQuery({
        queryKey: ["recipe", authorslug, slug],
        queryFn: () => getRecipe(authorslug ?? "", slug ?? ""),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
    useEffect(() => {
        const handleClickAnywhere = () => {
            setOpenRecipeIngredientId("");
        };
        document.addEventListener("click", handleClickAnywhere);
        return () => {
            document.removeEventListener("click", handleClickAnywhere);
        };
    }, []);
    useEffect(() => {
        if (!data) {
            return;
        }
        const interactions = data.interactions;
        setLikeCount(interactions.likes);
        setIsLiked(interactions.isLiked);
        setSaveCount(interactions.saves);
        setIsSaved(interactions.isSaved);
    }, [data]);
    const deleteMutation = useMutation({
        mutationFn: async () => {
            setIsDeleting(true);
            if (!data) return;
            await deleteRecipe(data.id);
        },
        onSuccess: () => {
            navigate(`/${user ? user.slug : ""}`);
        },
        onError: () => {
            setIsDeleting(false);
            setShowModal(false);
        },
    });
    if (isFetching) {
        return <div>Loading...</div>;
    }
    if (!data) {
        if (error instanceof AxiosError && error.response?.status === 404) {
            return <ErrorPage message="We couldn’t find what you’re looking for." />;
        }
        return <ErrorPage />;
    }
    if (!authorslug || !slug) {
        return <div>Invalid recipe URL</div>;
    }
    const handleToggleOpenRecipeIngredient = (id: string) => {
        if (openRecipeIngredientId === id) {
            setOpenRecipeIngredientId("");
            return;
        }
        setOpenRecipeIngredientId(id);
    };
    const handleClickLike = async () => {
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
                await likeRecipe(data.id);
                return;
            }
            await unlikeRecipe(data.id);
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
    const handleClickSave = async () => {
        const save = !isSaved;
        setIsSaved((prev) => !prev);
        setSaveCount((prev) => {
            if (prev === undefined) {
                return prev;
            }
            return save ? prev + 1 : prev - 1;
        });
        try {
            if (!isSaved) {
                await saveRecipe(data.id);
                return;
            }
            await unsaveRecipe(data.id);
            return;
        } catch (error) {
            setIsLiked((prev) => !prev);
            setLikeCount((prev) => {
                if (prev === undefined) {
                    return prev;
                }
                return save ? prev - 1 : prev + 1;
            });
        }
    };
    return (
        <div className="px-16 py-5">
            <div className="flex items-stretch border-2 border-gray-100 rounded-2xl">
                <div className="rounded-2xl flex-1 flex flex-col justify-center m-8">
                    <h1 className="!m-0">{data.name}</h1>
                    <div className="mb-6">{data.description}</div>
                    <div className="!m-0">
                        By <Link to={`/${authorslug}`}>{data.author}</Link>
                    </div>
                    <div className="text-gray-500">
                        {new Date(data.createdOn).toLocaleDateString("en-US", {
                            dateStyle: "medium",
                        })}
                    </div>
                    <div className="flex items-center mt-2">
                        <Heart
                            className={`mr-2 cursor-pointer ${
                                isLiked ? "fill-red-500 text-red-500" : ""
                            }`}
                            onClick={handleClickLike}
                        />
                        <span className="mr-4 cursor-pointer">{likeCount}</span>
                        <Bookmark
                            className={`mr-2 cursor-pointer ${
                                isSaved ? "fill-green-800 text-green-800" : ""
                            }`}
                            onClick={handleClickSave}
                        />
                        <span>{saveCount}</span>
                    </div>
                </div>
                {data.imageUrl && (
                    <div className="w-[38vw] flex items-center my-8 mr-8">
                        <div className="aspect-[4/3]">
                            <img
                                src={data.imageUrl}
                                className="object-cover rounded-2xl w-full h-full"
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-between gap-x-2 px-8 py-4 border-2 rounded-2xl border-gray-100 mt-2 h-fit text-base text-gray-700">
                <div className=" px-2  text-center">
                    <div className="font-semibold">Servings</div>
                    <div>{data.servings}</div>
                </div>
                <div className=" px-2  text-center">
                    <div className="font-semibold">Total Time</div>
                    <div>{data.totalTime} min.</div>
                </div>
                <div className=" px-2  text-center">
                    <div className="font-semibold">Prep Time</div>
                    <div>{data.prepTime} min.</div>
                </div>
                <div className=" px-2  text-center">
                    <div className="font-semibold">Cook Time</div>
                    <div>{data.cookTime} min.</div>
                </div>
            </div>
            <div className="flex flex-wrap mt-4 gap-5">
                <div className="px-8 py-4 rounded-2xl border-gray-100 border-2 w-fit">
                    <h2 className="!mb-2">Ingredients</h2>
                    <div className="pl-4 text-lg">
                        {data.recipeIngredientLines.map((riLine, index) => (
                            <RecipeIngredientLine
                                isAuthenticated={isAuthenticated}
                                recipeIngredientLineDTO={riLine}
                                key={index}
                                onToggleOpenRecipeIngredient={handleToggleOpenRecipeIngredient}
                                openRecipeIngredientId={openRecipeIngredientId}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex-1 min-w-100 w-full border-2 border-gray-100 rounded-2xl px-8 py-4">
                    <h2 className="!mb-2">Preparation</h2>
                    <div className="pl-2">
                        {data.preparation.map((step, index) => (
                            <div className="flex mb-3">
                                <span className="!m-0 font-bold">{index + 1}</span>
                                <span className="ml-5">{step}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {data.hasCompleteNutrientInfo && (
                <div>
                    <div className="bg-green-800 max-h-1 my-6 flex justify-center items-center rounded-2xl overflow-visible">
                        <BadgeCheck className="z-50 bg-white text-green-800" size={30} />
                    </div>
                    <div className="flex flex-wrap gap-5 items-stretch">
                        <div className="border-2 border-gray-100 rounded-2xl min-w-[300px] flex items-center flex-1">
                            <RecipeMacroNutrients nutrientFactsDTO={data.nutrientFacts} />
                        </div>
                        <div className="flex-1">
                            <RecipeNutritionFacts nutrientFactsDTO={data.nutrientFacts} />
                        </div>
                    </div>
                </div>
            )}
            {data.userIsAuthor && (
                <div>
                    <div className="flex justify-end px-4 mt-6">
                        <button
                            className="text-xs px-2 py-1 border-2 rounded-xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                            onClick={() => setShowModal(true)}
                        >
                            Delete Recipe
                        </button>
                    </div>
                </div>
            )}
            <div className="bg-gray-300 max-h-1 my-6 flex justify-center items-center rounded-2xl overflow-visible">
                <MessageCircle className="z-50 bg-white text-gray-300" size={30} />
            </div>
            <div className="mt-10 px-8 py-4 border-2 rounded-2xl border-gray-100">
                <CommentsSection recipeId={data.id} />
            </div>
            <div className="h-20"></div>
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 shadow-xl w-[90%] max-w-sm text-center">
                        {!isDeleting ? (
                            <div>
                                <h2 className="text-lg font-semibold mb-4">
                                    Are you sure you want to delete this recipe?
                                </h2>
                                <div className="flex justify-center gap-4">
                                    <button
                                        className="border-2 text-red-500 px-4 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                                        onClick={() => deleteMutation.mutate()}
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-200 px-4 py-2 rounded-xl hover:bg-gray-300 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <h2 className="text-lg font-semibold mt-3">Deleting recipe...</h2>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RecipePage;
