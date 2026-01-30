import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteRecipe, getRecipe } from "../../api/recipe-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import RecipeIngredientLine from "../../features/recipes/components/RecipeIngredientLine";
import { likeRecipe, saveRecipe, unlikeRecipe, unsaveRecipe } from "../../api/interaction-api";
import { useAuth } from "../../contexts/AuthContext";
import RecipeMacroNutrients from "../../features/recipes/components/RecipeMacroNutrients";
import RecipeNutritionFacts from "../../features/recipes/components/RecipeNutritionFacts";
import { BadgeCheck, Bookmark, CirclePlus, Heart, MessageCircle, Minus, Plus } from "lucide-react";
import CommentsSection from "../../features/recipes/components/CommentsSection";
import { AxiosError } from "axios";
import ErrorPage from "./ErrorPage";
import {
    deleteUserIngredient,
    deleteUserIngredientByName,
    saveIngredients,
} from "../../api/user-ingredient-api";
import type { IngredientDTO } from "../../features/recipes/types/ingredient-dto";
import type { RecipeIngredientLineDTO } from "../../features/recipes/types/recipe-ingredient-line-dto";
import toast from "react-hot-toast";

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
    const [recipeIngredientLineMatches, setRecipeIngredientLineMatches] = useState<
        { has: boolean; flipped: boolean }[]
    >([]);
    const userIngredientRequestQueue = useRef<
        { name: string; selectedVarietyName: string; add: boolean }[]
    >([]);
    const queueRunning = useRef<boolean>(false);
    const { isAuthenticated, user } = useAuth();
    const { isFetching, data, error } = useQuery({
        queryKey: ["recipe", authorslug, slug],
        queryFn: () => getRecipe(authorslug ?? "", slug ?? ""),
        refetchOnWindowFocus: false,
    });
    const enqueue = (ingredientRequest: {
        name: string;
        selectedVarietyName: string;
        add: boolean;
    }) => {
        userIngredientRequestQueue.current.push(ingredientRequest);
        runQueue();
    };
    const runQueue = async () => {
        if (queueRunning.current) return;
        queueRunning.current = true;
        try {
            while (userIngredientRequestQueue.current.length > 0) {
                const request = userIngredientRequestQueue.current.shift();
                if (!request) break;
                if (request.add) {
                    await saveIngredients([
                        {
                            name: request.name,
                            selectedVarietyName: request.selectedVarietyName,
                        },
                    ]);
                    toast.success(`Added ${request.name} to your ingredients`);
                } else {
                    await deleteUserIngredientByName(request.name);
                    toast.success(`Removed ${request.name} from your ingredients`);
                }
            }
        } catch (error) {
            toast.error("An error occurred while updating your ingredients. Reloading the page.");
            await new Promise((resolve) => setTimeout(resolve, 5000));
            window.location.reload();
        }

        queueRunning.current = false;
    };
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
        setRecipeIngredientLineMatches(() => {
            return data.recipeIngredientLines.map((riLine) => {
                return {
                    has: riLine.recipeIngredients.every((ri) => {
                        return ri.ingredientMatch.status === "match";
                    }),
                    flipped: false,
                };
            });
        });
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
    const handleAddRemoveIngredientLine = async (lineIndex: number) => {
        setRecipeIngredientLineMatches((prev) => {
            const oldMatch = prev[lineIndex];
            const newMatches = [...prev];
            newMatches[lineIndex] = {
                flipped: !oldMatch.flipped,
                has: oldMatch.has,
            };
            return newMatches;
        });
        const riLineMatch = recipeIngredientLineMatches[lineIndex];
        const hasIngredient = riLineMatch.has !== riLineMatch.flipped;
        const riLine = data.recipeIngredientLines[lineIndex];
        const reqs = riLine.recipeIngredients.map((ri) => {
            return {
                name: ri.ingredient.name,
                selectedVarietyName: ri.ingredient.selectedVariety.name,
                add: !hasIngredient,
            };
        });
        reqs.forEach((req) => enqueue(req));
    };
    const handleAddAllIngredients = async () => {};
    const getNewMatchRecipeIngredientLineDTO = (
        riLine: RecipeIngredientLineDTO,
        index: number
    ): RecipeIngredientLineDTO => {
        let newRiLineDTO = { ...riLine };
        const riLineMatch = recipeIngredientLineMatches[index];
        if (riLineMatch && riLineMatch.flipped && !riLineMatch.has) {
            newRiLineDTO.recipeIngredients = newRiLineDTO.recipeIngredients.map((ri) => {
                const newMatchingIngredient: IngredientDTO = {
                    name: ri.ingredient.name,
                    selectedVariety: ri.ingredient.selectedVariety,
                };
                return {
                    ...ri,
                    ingredientMatch: {
                        ...ri.ingredientMatch,
                        status: "match",
                        matchingIngredients: [
                            ...ri.ingredientMatch.matchingIngredients,
                            newMatchingIngredient,
                        ],
                    },
                };
            });
        }
        if (riLineMatch && riLineMatch.flipped && riLineMatch.has) {
            newRiLineDTO.recipeIngredients = newRiLineDTO.recipeIngredients.map((ri) => {
                return {
                    ...ri,
                    ingredientMatch: {
                        ...ri.ingredientMatch,
                        status: "no-match",
                        matchingIngredients: [],
                    },
                };
            });
        }
        return newRiLineDTO;
    };
    return (
        <div className="mt-8">
            <div className="flex flex-wrap justify-center gap-y-8">
                <div className="flex flex-col justify-center flex-1 min-w-80 pl-14 pr-7">
                    <div className="text-5xl font-bold mb-6">{data.name}</div>
                    <div className="!m-0">
                        By{" "}
                        <Link to={`/${authorslug}`}>
                            <span className="underline hover:text-green-900">{data.author} </span>
                        </Link>
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
                    <div className="aspect-[4/3] flex-1 min-w-150 lg:px-4">
                        <img src={data.imageUrl} className="object-cover w-full h-full" />
                    </div>
                )}
            </div>
            <div className="px-8 sm:px-16 py-6 border-y-1 mt-6 border-gray-200">
                {data.description}
            </div>
            <div className="flex items-center justify-between gap-x-2 px-8 sm:px-16 py-3 border-b-1 border-gray-200 h-fit text-base">
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
            <div className="flex flex-wrap mt-6 gap-y-6">
                <div className="pr-16 w-fit">
                    <h2 className="!mb-2 px-16">Ingredients</h2>
                    <div className="text-lg pl-8">
                        {data.recipeIngredientLines.map((riLine, index) => {
                            const riLineMatch = recipeIngredientLineMatches[index];
                            const newRiLineDTO = getNewMatchRecipeIngredientLineDTO(riLine, index);
                            return (
                                <div className="flex" key={"riLine" + index}>
                                    {!isAuthenticated || !riLineMatch ? (
                                        <div className="mr-8" />
                                    ) : riLineMatch.has === riLineMatch.flipped ? (
                                        <CirclePlus
                                            className="w-5 text-gray-300 mr-3 hover:text-green-600 cursor-pointer"
                                            onClick={() => handleAddRemoveIngredientLine(index)}
                                        />
                                    ) : (
                                        <Minus
                                            className="w-5 text-gray-300 mr-3 hover:text-red-600 cursor-pointer"
                                            onClick={() => handleAddRemoveIngredientLine(index)}
                                        />
                                    )}
                                    <RecipeIngredientLine
                                        isAuthenticated={isAuthenticated}
                                        recipeIngredientLineDTO={newRiLineDTO}
                                        key={index}
                                        onToggleOpenRecipeIngredient={
                                            handleToggleOpenRecipeIngredient
                                        }
                                        openRecipeIngredientId={openRecipeIngredientId}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {/* <div className="text-sm ml-16 mt-6 rounded-xl cursor-pointer border-1 px-4 py-2 text-green-800 border-green-800 hover:bg-green-800 hover:text-white w-fit">
                        Add these ingredients to ingredient list
                    </div>
                    <div className="text-sm ml-16 mt-2 rounded-xl cursor-pointer border-1 px-4 py-2 text-red-600 border-red-600 hover:bg-red-600 hover:text-white w-fit">
                        Remove these ingredients from ingredient list
                    </div> */}
                    <div>
                        <CirclePlus /> Add Ingredient
                    </div>
                </div>
                <div className="flex-1 min-w-100 w-full px-16">
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
                    <div className="flex justify-end px-4 mt-6 gap-x-2">
                        <button
                            className="text-sm px-2 py-1 border-2 rounded-xl border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
                            onClick={() => navigate(`/${authorslug}/${slug}/edit`)}
                        >
                            Edit
                        </button>
                        <button
                            className="text-sm px-2 py-1 border-2 rounded-xl border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                            onClick={() => setShowModal(true)}
                        >
                            Delete Recipe
                        </button>
                    </div>
                </div>
            )}
            <div className="mt-10 px-8 mx-8 border-1 border-gray-200 py-4 rounded-2xl">
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
