import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../../components/ImageUploader";
import InputBox from "../../components/InputBox";
import TextAreaBox from "../../components/TextAreaBox";
import RecipeIngredientLineInputArea from "../../features/recipes/components/RecipeIngredientLineInputArea";
import PreparationInputArea from "../../features/recipes/components/PreparationInputArea";
import type { CreateRecipeRequestDTO } from "../../features/recipes/types/requests/create-recipe-request-dto";
import type { RecipeIngredientLineRequestDTO } from "../../features/recipes/types/requests/create-recipe-request-dto";
import { useMutation } from "@tanstack/react-query";
import { createRecipe } from "../../api/recipe-api";

function CreateRecipePage() {
    const [request, setRequest] = useState<{
        name?: string;
        prepTime?: string;
        cookTime?: string;
        servings?: string;
        description?: string;
        recipeIngredientLines?: RecipeIngredientLineRequestDTO[];
        preparation?: string[];
    }>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [inputError, setInputError] = useState<string | null>(null);
    const [createButtonClickable, setCreateButtonClickable] = useState<boolean>(true);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate("/login");
    }

    const mutation = useMutation({
        mutationFn: createRecipe,
        onSuccess: () => {
            navigate(`/${user?.slug}`); // Navigate to user's profile page after creation
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
        if (!request.name || request.name.length === 0) {
            setInputError("Name is required");
            return null;
        }
        if (!request.prepTime || !/^\d+$/.test(request.prepTime)) {
            setInputError("Prep Time must be a non-negative number");
            return null;
        }
        if (!request.cookTime || !/^\d+$/.test(request.cookTime)) {
            setInputError("Cook Time must be a non-negative number");
            return null;
        }
        if (!request.servings || !/^\d+$/.test(request.servings)) {
            setInputError("Servings must be a positive number");
            return null;
        }
        if (!request.recipeIngredientLines || request.recipeIngredientLines.length === 0) {
            setInputError("At least one ingredient line is required");
            return null;
        }
        if (!request.preparation || request.preparation.length === 0) {
            setInputError("At least one preparation step is required");
            return null;
        }
        for (const step of request.preparation) {
            if (!step || step.length === 0) {
                setInputError("Each preparation step must have text");
                return null;
            }
        }
        return {
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
        ? "border-green-800 hover:bg-green-200 text-green-800 transition-colors duration-200 cursor-pointer"
        : "border-gray-400 text-gray-400 cursor-not-allowed";
    return (
        <div>
            <h1>Create a Recipe</h1>
            <div className="flex w-full flex-wrap mb-4">
                <div className="min-w-[60%] mr-2">
                    <div className="flex items-center mb-3">
                        <label className="w-50">Name:</label>
                        <InputBox
                            maxChars={60}
                            placeholder="Recipe Name"
                            onChange={(value) => setRequest({ ...request, name: value })}
                            className="w-100 rounded-lg"
                        />
                    </div>
                    <div className="flex items-center mb-3">
                        <label className="w-50">Prep Time (minutes):</label>
                        <InputBox
                            maxChars={3}
                            placeholder="20"
                            onChange={(value) => setRequest({ ...request, prepTime: value })}
                            className="w-15 rounded-lg"
                        />
                    </div>
                    <div className="flex items-center mb-3">
                        <label className="w-50">Cook Time (minutes):</label>
                        <InputBox
                            maxChars={3}
                            placeholder="30"
                            onChange={(value) => setRequest({ ...request, cookTime: value })}
                            className="w-15 rounded-lg"
                        />
                    </div>
                    <div className="flex items-center mb-3">
                        <label className="w-50">Servings:</label>
                        <InputBox
                            maxChars={3}
                            placeholder="2"
                            onChange={(value) => setRequest({ ...request, servings: value })}
                            className="w-15 rounded-lg"
                        />
                    </div>
                    <div className="mb-3">
                        <h4>Description</h4>
                        <TextAreaBox
                            placeholder="A brief description of the recipe."
                            onChange={(value) => setRequest({ ...request, description: value })}
                        />
                    </div>
                    <div className="mb-3">
                        <h4 className="!m-0">Ingredients</h4>
                        <p className="!m-0 !mb-4 text-xs">
                            <i>If your ingredient wasn't detected, double click it to search</i>{" "}
                        </p>
                        <RecipeIngredientLineInputArea
                            onChange={(requests) =>
                                setRequest({ ...request, recipeIngredientLines: requests })
                            }
                        />
                    </div>
                    <div className="mb-3">
                        <h4>Preparation</h4>
                        <PreparationInputArea
                            onChange={(value) => setRequest({ ...request, preparation: value })}
                        />
                    </div>
                </div>
                <div className="min-w-[35%]">
                    <ImageUploader onChange={(file) => setImageFile(file)} />
                </div>
            </div>
            <div className="flex items-center">
                <button
                    className={`border-2 rounded-2xl w-20 h-10 mr-5 ${createButtonStyle}`}
                    onClick={() => handleCreate()}
                >
                    Create
                </button>
                {mutation.isPending && <div>Creating...</div>}
                {mutation.isIdle && inputError && (
                    <div className="text-red-500">
                        <i>{inputError}</i>
                    </div>
                )}
            </div>
            <div className="h-30"></div>
        </div>
    );
}

export default CreateRecipePage;
