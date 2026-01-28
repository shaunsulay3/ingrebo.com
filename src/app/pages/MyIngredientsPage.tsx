import { useEffect, useState } from "react";
import {
    deleteUserIngredient,
    getUserIngredientsCategorized,
    updateUserIngredient,
} from "../../api/user-ingredient-api";
import UserIngredientInputArea from "../../features/user-ingredients/components/UserIngredientInputArea";
import { useQuery } from "@tanstack/react-query";
import UserIngredient from "../../features/user-ingredients/components/UserIngredient";
import type { UserIngredientDTO } from "../../features/user-ingredients/types/user-ingredient-dto";
import ErrorPage from "./ErrorPage";

type UserIngredientObject = {
    categoryIndex: number;
    isOpen: boolean;
    id: string;
    userIngredientDTO: UserIngredientDTO;
};
export default function MyIngredientsPage() {
    const { data, isFetching } = useQuery({
        queryFn: getUserIngredientsCategorized,
        queryKey: ["user-ingredients-categorized"],
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [userIngredientObjects, setUserIngredientObjects] = useState<UserIngredientObject[]>([]);

    useEffect(() => {
        if (!data) {
            return;
        }
        let ctg: string[] = [];
        let uiObjects: UserIngredientObject[] = [];
        data.forEach((userIngredientCategory, index) => {
            ctg.push(userIngredientCategory.category);
            userIngredientCategory.userIngredients.forEach((userIngredient) => {
                if (!userIngredient.id) {
                    throw new Error("Received user ingredient with undefined id");
                }
                const id = userIngredient.id.toString();
                uiObjects.push({
                    categoryIndex: index,
                    isOpen: false,
                    id: id,
                    userIngredientDTO: userIngredient,
                });
            });
        });
        setCategories(ctg);
        setUserIngredientObjects(uiObjects);
    }, [data]);

    const handleToggleOpen = (id: string) => {
        setUserIngredientObjects((prev) => {
            return prev.map((ingObj) => {
                if (ingObj.id === id) {
                    return {
                        ...ingObj,
                        isOpen: !ingObj.isOpen,
                    };
                }
                return {
                    ...ingObj,
                    isOpen: false,
                };
            });
        });
    };
    const handleDelete = async (id: string) => {
        const backup = userIngredientObjects.find((ingObj) => ingObj.id === id);
        setUserIngredientObjects((prev) => prev.filter((ingObj) => ingObj.id !== id));
        try {
            await deleteUserIngredient(id);
        } catch (error) {
            if (backup) {
                setUserIngredientObjects((prev) => [...prev, backup]);
            }
        }
    };
    const handleUpdateVariety = async (id: string, selectedVarietyName: string) => {
        const backup = userIngredientObjects.find((ingObj) => ingObj.id === id);
        try {
            await updateUserIngredient(id, selectedVarietyName);
        } catch (error) {
            if (backup) {
                setUserIngredientObjects((prev) => {
                    return prev.map((ingObj) => {
                        if (ingObj.id === id) {
                            return backup;
                        }
                        return ingObj;
                    });
                });
            }
        }
    };
    if (isFetching) {
        return <div>Loading...</div>;
    }
    if (!data) {
        return <ErrorPage />;
    }
    return (
        <div className="w-full px-4">
            <div className="">
                <UserIngredientInputArea />
            </div>
            {categories.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-5">
                    {categories.map((category, categoryIndex) => {
                        if (
                            !userIngredientObjects.some((ui) => ui.categoryIndex === categoryIndex)
                        ) {
                            return null;
                        }
                        return (
                            <div
                                key={category}
                                className="border-2 border-gray-200 rounded-2xl px-4 pt-2 pb-4"
                            >
                                <h4>{category}</h4>
                                <div className="flex flex-wrap gap-3">
                                    {userIngredientObjects
                                        .filter((ui) => ui.categoryIndex === categoryIndex)
                                        .map((ingredientObject) => (
                                            <UserIngredient
                                                key={"my-ingredient-" + ingredientObject.id}
                                                name={ingredientObject.userIngredientDTO.name}
                                                id={ingredientObject.id}
                                                userIngredientDTO={
                                                    ingredientObject.userIngredientDTO
                                                }
                                                isOpen={ingredientObject.isOpen}
                                                onDelete={handleDelete}
                                                onUpdateVariety={handleUpdateVariety}
                                                onToggleOpen={handleToggleOpen}
                                                search={false}
                                            />
                                        ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
