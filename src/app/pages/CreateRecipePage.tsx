import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import ImageUploader from "../../components/ImageUploader";
import InputBox from "../../components/InputBox";
import TextAreaBox from "../../components/TextAreaBox";
import RecipeIngredientLineInputArea from "../../features/recipes/components/RecipeIngredientLineInputArea";
import PreparationInputArea from "../../features/recipes/components/PreparationInputArea";
import type {
    CreateRecipeRequestDTO,
    RecipeIngredientRequestDTO,
} from "../../features/recipes/types/requests/create-recipe-request-dto";
import type { RecipeIngredientLineRequestDTO } from "../../features/recipes/types/requests/create-recipe-request-dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createRecipe, getRecipe } from "../../api/recipe-api";
import { BadgeCheck, LockIcon } from "lucide-react";
import toast from "react-hot-toast";
import LoadingPage from "./LoadingPage";

function CreateRecipePage({ edit = false }: { edit?: boolean }) {
    const [editDataSet, setEditDataSet] = useState<boolean>(false);
    const [request, setRequest] = useState<{
        name?: string;
        prepTime?: string;
        cookTime?: string;
        servings?: string;
        description?: string;
        recipeIngredientLines?: RecipeIngredientLineRequestDTO[];
        preparation?: string[];
    }>({});
    const { authorslug, slug } = useParams();
    const { data, isFetching } = useQuery({
        queryKey: ["edit", authorslug, slug],
        queryFn: () => getRecipe(authorslug ?? "", slug ?? ""),
        enabled: edit,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [erroMessage, setErrorMessage] = useState<string | null>(null);
    const [createButtonClickable, setCreateButtonClickable] = useState<boolean>(true);
    const { isAuthenticated, user } = useAuth();
    const [hasCompleteNutrientInfo, setHasCompleteNutrientInfo] = useState<boolean>(false);

    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate("/login");
    }

    const mutation = useMutation({
        mutationFn: ({
            recipeData,
            imageFile,
        }: {
            recipeData: CreateRecipeRequestDTO;
            imageFile: File | null;
        }) =>
            toast.promise(createRecipe({ recipeData, imageFile }), {
                loading: `${
                    edit ? "Saving your changes" : "Creating recipe"
                }... Please don't leave the page...`,
                success: `${edit ? "Recipe updated" : "Recipe created"} successfully!`,
            }),
        onSuccess: () => {
            window.location.href = `/${user?.slug}`; // Navigate to user's profile page after creation
        },
        onError: (error: any) => {
            toast.error(
                error?.response?.data?.message ??
                    "An error occurred while creating the recipe. Please try again later."
            );
        },
    });

    useEffect(() => {
        if (createButtonClickable) {
            return;
        }
        setCreateButtonClickable(true);
    }, [request]);

    const handleCreate = () => {
        const validRequest = getValidRequest();
        if (!validRequest) {
            setCreateButtonClickable(false);
            return;
        }
        mutation.mutate({
            recipeData: validRequest,
            imageFile: imageFile,
        });
    };

    const getValidRequest = (): CreateRecipeRequestDTO | null => {
        if (edit && !data) {
            setErrorMessage("Failed to get existing recipe id for editing.");
            return null;
        }
        if (!request.name || request.name.length === 0) {
            setErrorMessage("Name is required");
            return null;
        }
        if (!request.prepTime || !/^\d+$/.test(request.prepTime)) {
            setErrorMessage("Please provide a valid Prep Time");
            return null;
        }
        if (!request.cookTime || !/^\d+$/.test(request.cookTime)) {
            setErrorMessage("Please provide a valid Cook Time");
            return null;
        }
        if (!request.servings || !/^\d+$/.test(request.servings)) {
            setErrorMessage("Please provide valid amount of servings");
            return null;
        }
        if (!request.recipeIngredientLines || request.recipeIngredientLines.length === 0) {
            setErrorMessage("At least one ingredient line is required");
            return null;
        }
        if (!request.recipeIngredientLines.some((line) => line.recipeIngredients.length > 0)) {
            setErrorMessage(
                "Your recipe has no ingredients. If you don't have any highlighted ingredients, please double click them to search and add."
            );
            return null;
        }
        if (!request.preparation || request.preparation.length === 0) {
            setErrorMessage("At least one preparation step is required");
            return null;
        }
        for (const step of request.preparation) {
            if (!step || step.length === 0) {
                setErrorMessage("Each preparation step must have text");
                return null;
            }
        }
        return {
            id: edit && data ? data.id : undefined,
            name: request.name,
            prepTime: Number(request.prepTime),
            cookTime: Number(request.cookTime),
            servings: Number(request.servings),
            description: request.description ?? "",
            preparation: request.preparation,
            recipeIngredientLines: request.recipeIngredientLines,
        };
    };
    const createButtonStyle = createButtonClickable
        ? "border-green-800 hover:bg-green-800 text-green-800 hover:text-white transition-colors duration-100 cursor-pointer"
        : "border-gray-400 text-gray-400 cursor-not-allowed";

    if (edit && isFetching) {
        return (
            <div>
                <LoadingPage />
            </div>
        );
    }
    if (edit && !data) {
        return <div>Failed to load recipe data.</div>;
    }
    if (edit && data && !editDataSet) {
        setRequest({
            name: data.name,
            prepTime: data.prepTime.toString(),
            cookTime: data.cookTime.toString(),
            servings: data.servings.toString(),
            description: data.description,
            recipeIngredientLines: data.recipeIngredientLines.map((riLine) => {
                const line = riLine.line;
                const recipeIngredientRequests: RecipeIngredientRequestDTO[] = [];
                riLine.recipeIngredients.forEach((ri) => {
                    recipeIngredientRequests.push({
                        ingredientIndex: {
                            start: ri.ingredientIndex.start,
                            end: ri.ingredientIndex.end,
                        },
                        selectedVariety: ri.ingredient.selectedVariety.name,
                        specificOption: ri.specificOption ?? undefined,
                    });
                });
                return {
                    line: line,
                    recipeIngredients: recipeIngredientRequests,
                };
            }),
            preparation: data.preparation,
        });
        setEditDataSet(true);
    }
    return (
        <div className="">
            <div className="h-18 flex items-center justify-end px-8 text-2xl font-extrabold border-b mb-8 text-green-900 border-gray-200">
                Edit Recipe
            </div>
            <div className="flex flex-wrap  justify-between gap-y-4 items-center mx-20 mb-4">
                <div className=" max-w-150 w-full">
                    <InputBox
                        maxChars={60}
                        placeholder="Name"
                        onChange={(value) => setRequest({ ...request, name: value })}
                        className="w-50 rounded-lg border-0 pl-3 bg-gray-100 mb-2 "
                        value={request.name}
                    />
                    <TextAreaBox
                        placeholder="Description"
                        onChange={(value) => setRequest({ ...request, description: value })}
                        value={request.description}
                        className="bg-gray-100 border-0 w-100 h-40 mb-1"
                    />
                    <div className="flex gap-2 flex-wrap items-center">
                        <InputBox
                            maxChars={3}
                            placeholder="Prep Time (minutes)"
                            onChange={(value) => setRequest({ ...request, prepTime: value })}
                            className="w-44 rounded-lg bg-gray-100 border-0 pl-3"
                            value={request.prepTime}
                        />
                        <InputBox
                            maxChars={3}
                            placeholder="Cook Time (minutes)"
                            onChange={(value) => setRequest({ ...request, cookTime: value })}
                            className="w-44 rounded-lg bg-gray-100 border-0 pl-3"
                            value={request.cookTime}
                        />
                        <InputBox
                            maxChars={3}
                            placeholder="# of Servings"
                            onChange={(value) => setRequest({ ...request, servings: value })}
                            className="w-44 rounded-lg bg-gray-100 border-0 pl-3"
                            value={request.servings}
                        />
                    </div>
                </div>
                <div className="">
                    <ImageUploader onChange={(file) => setImageFile(file)} />
                </div>
            </div>
            <div className="border-gray-200 border mx-8 min-w-fit rounded-xl mb-4">
                <h4 className="border-b-1 border-gray-200 pl-8 py-4 bg-gray-100 text-gray-600 font-bold">
                    Ingredients
                </h4>
                <div className=" mb-3 flex flex-wrap gap-x-5 gap-y-5 justify-between py-4 px-6  ">
                    <div className="overflow-visible">
                        <p className="!m-0 !mb-4 text-sm">
                            <i>
                                If your ingredient wasn't detected, <b>double click</b> it to search
                            </i>{" "}
                            <br></br>
                            <i>
                                <b>click</b> the highlighted ingredient for more information or to
                                change it's variety
                            </i>
                        </p>

                        <RecipeIngredientLineInputArea
                            onChange={(requests) =>
                                setRequest({ ...request, recipeIngredientLines: requests })
                            }
                            initialRecipeIngredientLines={request.recipeIngredientLines?.map(
                                (riLineRequest) => {
                                    return riLineRequest.line;
                                }
                            )}
                            initialIngredientIndices={request.recipeIngredientLines?.flatMap(
                                (riLineRequest, index) => {
                                    return riLineRequest.recipeIngredients.map((riRequest) => {
                                        return {
                                            start: riRequest.ingredientIndex.start,
                                            end: riRequest.ingredientIndex.end,
                                            line: index,
                                            selectedVarietyName: riRequest.selectedVariety,
                                            specificOptionDescription: riRequest.specificOption,
                                        };
                                    });
                                }
                            )}
                            onChangeCompleteNutrientInfo={(complete) =>
                                setHasCompleteNutrientInfo(complete)
                            }
                        />
                    </div>
                    <div className="mx-20 p-4 min-w-50 max-w-80 rounded-2xl text-sm h-fit border border-gray-200">
                        <h4 className="!m-0 text-green-800">Nutrient Facts (optional)</h4>
                        <h6 className="text-gray-600 border-b-1">
                            Based on data from the <br></br>
                            <span className="font-semibold">USDA Food Data Central</span>
                        </h6>
                        <div className="text-sm">
                            Every ingredient in your recipe must satisfy the two conditions below in
                            order for ingrebo to calculate nutrient information{" "}
                            <BadgeCheck className="inline-block text-green-800 w-5 pb-1" />{" "}
                            <ul className="bulleted-list">
                                <li>
                                    A <b>valid amount</b>: <br></br>(ex: 1 cup, 2 cloves, 20 grams)
                                </li>
                                <li>
                                    A <b>specified option</b>: <br></br>(ex: "butter, stick,
                                    unsalted")
                                </li>
                            </ul>
                            The <b>specified option</b> is what ingrebo uses to lookup nutrition
                            data. By default, Ingrebo picks one for you. To change it, <b>click</b>{" "}
                            the highlighted ingredient.
                        </div>
                    </div>
                </div>
                <div className=" p-4 border-t-1 border-gray-200 rounded-b-xl">
                    {!hasCompleteNutrientInfo ? (
                        <div className="flex justify-center items-center">
                            <div className="text-lg text-gray-600 pr-2">Nutrition Facts</div>
                            <LockIcon className="text-gray-600 w-5 font-bold" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex justify-center items-center">
                                <div className="text-lg text-green-900">
                                    Nutrition Facts Available
                                </div>
                                <BadgeCheck className="text-green-800 w-5 mx-4" />
                                <div className="text-lg text-green-900">
                                    {edit
                                        ? "Finish editing the Recipe to see"
                                        : "Create Recipe to See"}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mb-3 mx-15 border-gray-200 border rounded-xl">
                <h4 className="border-b-1 text-xl border-gray-200 pl-8 py-4 bg-gray-100 text-gray-600 font-bold">
                    Preparation
                </h4>
                <div className="pb-4 px-6">
                    <PreparationInputArea
                        initialSteps={request.preparation}
                        onChange={(value) => setRequest({ ...request, preparation: value })}
                    />
                </div>
            </div>
            <div className="flex items-center px-16">
                <button
                    className={`border-2 rounded-2xl px-4 py-2 mr-5 ${createButtonStyle}`}
                    onClick={() => handleCreate()}
                >
                    {edit ? "Save Changes" : "Create"}
                </button>
                {mutation.isIdle && erroMessage && (
                    <div className="text-red-500">
                        <i>{erroMessage}</i>
                    </div>
                )}
            </div>
            <div className="h-30"></div>
        </div>
    );
}

export default CreateRecipePage;
