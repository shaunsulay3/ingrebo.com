import { useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import InputBox from "../../../components/InputBox";
import UserIngredient from "./UserIngredient";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { saveIngredients } from "../../../api/user-ingredient-api";
import { v4 as uuid } from "uuid";
import lodash from "lodash";

type Ingredient = {
    id: string;
    name: string;
    variety: string | null;
    isOpen: boolean;
};
export default function UserIngredientInputArea({ onSave }: { onSave: () => void }) {
    const [input, setInput] = useState<string>("");
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [ingredientError, setIngredientError] = useState<Ingredient | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
        const handleClickAnywhere = (e: MouseEvent) => {
            setIngredients((prev) => prev.map((ingredient) => ({ ...ingredient, isOpen: false })));
        };
        document.addEventListener("click", handleClickAnywhere);
        return () => {
            document.removeEventListener("click", handleClickAnywhere);
        };
    }, []);

    useEffect(() => {
        const deletedFailedIngredient = ingredients.find((ing) => {
            return lodash.isEqualWith(
                lodash.omit(ing, ["isOpen"]),
                lodash.omit(ingredientError, ["isOpen"])
            );
        });
        if (!deletedFailedIngredient) {
            setIngredientError(null);
        }
    }, [ingredients]);

    const mutation = useMutation({
        mutationFn: saveIngredients,
        onSuccess: onSave,
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddIngredient();
        }
    };
    const handleAddIngredient = (): void => {
        if (input.trim() !== "") {
            setIngredients([
                ...ingredients,
                { name: input.trim(), variety: null, isOpen: false, id: uuid() },
            ]);
            setInput("");
        }
    };
    const handleDelete = (id: string) => {
        setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
    };
    const handleUpdateVariety = (id: string, varietyName: string) => {
        setIngredients((prev) =>
            prev.map((ingredient) =>
                ingredient.id === id ? { ...ingredient, variety: varietyName } : ingredient
            )
        );
    };
    const handleToggleOpen = (id: string) => {
        setIngredients((prev) => {
            const copy = prev.map((ingredient) =>
                ingredient.id === id
                    ? { ...ingredient, isOpen: !ingredient.isOpen }
                    : { ...ingredient, isOpen: false }
            );
            return copy;
        });
    };
    const handleSave = () => {
        const failedIngredient = ingredients.find((ingredient) => !ingredient.variety);
        if (failedIngredient) {
            setIngredientError(failedIngredient);
            return;
        }
        const ingredientsToSave = ingredients.map((ingredient) => {
            if (!ingredient.variety) {
                throw new Error("Variety name is null on save attempt");
            }
            return {
                name: ingredient.name,
                selectedVarietyName: ingredient.variety,
            };
        });
        setSaving(true);
        mutation.mutate(ingredientsToSave);
    };

    return (
        <div>
            <div className="px-8 py-2 border-green-800 border-b-2">
                <div className={`flex flex-wrap items-center gap-x-4`}>
                    <div className=" text-green-800 text-3xl font-semibold">
                        {user ? user.username + "'s Ingredients" : "My Ingredients"}
                    </div>
                    <div className="flex items-center flex-1 gap-x-2">
                        <InputBox
                            className={
                                "my-3 min-w-50 w-full border-0 border-b-1 h-10 border-green-800 text-green-800"
                            }
                            focus={false}
                            maxChars={40}
                            placeholder="Type an ingredient to add and press enter.."
                            onKeyDown={handleKeyDown}
                            onChange={(value) => setInput(value)}
                            value={input}
                        />
                        <button
                            className={`${
                                saving || ingredients.length === 0
                                    ? "bg-gray-400 text-white"
                                    : "border-2 border-green-800 text-green-800 hover:bg-green-800 hover:text-white cursor-pointer"
                            }  rounded-xl px-3 py-1 duration-200`}
                            onClick={() => {
                                if (ingredients.length > 0) {
                                    handleSave();
                                }
                            }}
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
                {ingredients.length > 0 && (
                    <div className="flex flex-wrap gap-y-3 gap-x-5 mb-3">
                        {ingredients.map((ingredient) => (
                            <UserIngredient
                                key={ingredient.name}
                                id={ingredient.id}
                                onDelete={handleDelete}
                                onUpdateVariety={handleUpdateVariety}
                                name={ingredient.name}
                                isOpen={ingredient.isOpen}
                                onToggleOpen={handleToggleOpen}
                                search={true}
                            />
                        ))}
                    </div>
                )}
                {!saving && ingredientError && (
                    <div className="text-red-600 ml-3">
                        <i>{`${ingredientError.name} could not be found`}</i>
                    </div>
                )}
            </div>
        </div>
    );
}
