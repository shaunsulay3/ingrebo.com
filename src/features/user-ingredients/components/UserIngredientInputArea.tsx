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
export default function UserIngredientInputArea() {
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
        onSuccess: () => {
            window.location.reload();
        },
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" && input.trim() !== "") {
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
            <div className={`flex justify-between items-center px-5 bg-gray-100 rounded-2xl`}>
                <h1 className="mt-3 text-green-950">
                    {user ? user.username + "'s Ingredients" : "My Ingredients"}
                </h1>
                <div className="flex items-center">
                    <InputBox
                        className={"my-3 w-150 bg-white rounded-2xl h-10 border-0"}
                        maxChars={40}
                        placeholder="Type an ingredient to add and press enter.."
                        onKeyDown={handleKeyDown}
                        onChange={(value) => setInput(value)}
                        value={input}
                    />
                    <button className="ml-3  px-3 py-2 bg-white rounded-2xl text-green-900">
                        Add
                    </button>
                </div>
            </div>
            {ingredients.length > 0 && (
                <div className="mt-4 rounded-2xl border-gray-100 border-4 flex flex-wrap px-5 gap-y-3 gap-x-5 py-3">
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
            {ingredients.length > 0 && (
                <div className="flex items-center mt-4">
                    <button
                        className="border-2 border-green-700 rounded-2xl px-3 py-1 text-green-700 cursor-pointer hover:bg-green-700 hover:text-white duration-200"
                        onClick={() => handleSave()}
                    >
                        Save
                    </button>
                    {saving && <div className="ml-3 text-green-700">Saving...</div>}
                    {!saving && ingredientError && (
                        <div className="text-red-600 ml-3">
                            <i>{`${ingredientError.name} could not be found`}</i>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
