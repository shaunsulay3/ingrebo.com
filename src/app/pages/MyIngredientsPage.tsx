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
import LoadingPage from "./LoadingPage";

type UserIngredientObject = {
    categoryIndex: number;
    isOpen: boolean;
    id: string;
    userIngredientDTO: UserIngredientDTO;
};
export default function MyIngredientsPage() {
    const { data, isFetching, refetch } = useQuery({
        queryFn: getUserIngredientsCategorized,
        queryKey: ["user-ingredients-categorized"],
        staleTime: 0,
    });
    const [categories, setCategories] = useState<string[]>([]);
    const [userIngredientObjects, setUserIngredientObjects] = useState<UserIngredientObject[]>([]);

    useEffect(() => {
        if (!data) {
            return;
        }
        const CATEGORY_ORDER = [
            "Produce",
            "Protein",
            "Grains and Baked Goods",
            "Dairy and Egg Products",
            "Other",
        ] as const;
        type Category = (typeof CATEGORY_ORDER)[number];

        const categoryRank = new Map(CATEGORY_ORDER.map((cat, i) => [cat, i]));
        data.sort((a, b) => {
            const rankA = categoryRank.get(a.category as Category) ?? Number.MAX_SAFE_INTEGER;
            const rankB = categoryRank.get(b.category as Category) ?? Number.MAX_SAFE_INTEGER;

            return rankA - rankB;
        });
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
    const handleSave = () => {
        refetch();
    };
    const getCategoryColor = (categoryName: string) => {
        switch (categoryName) {
            case "Pantry, Snacks, and Drinks":
                return "bg-orange-100 text-orange-800";
            case "Produce":
                return "bg-green-100 text-green-800";
            case "Dairy and Egg Products":
                return "bg-purple-100 text-purple-800";
            case "Grains and Baked Goods":
                return "bg-blue-100 text-blue-800";
            case "Protein":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100";
        }
    };
    if (isFetching) {
        return (
            <div>
                <LoadingPage />
            </div>
        );
    }
    if (!data) {
        return <ErrorPage />;
    }
    return (
        <div className="w-full px-4">
            <div className="">
                <UserIngredientInputArea onSave={handleSave} />
            </div>
            {categories.length > 0 && (
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 
                [&>*:nth-child(odd):last-child]:sm:col-span-2 px-4 pb-4"
                >
                    {categories.map((category, categoryIndex) => {
                        if (
                            !userIngredientObjects.some((ui) => ui.categoryIndex === categoryIndex)
                        ) {
                            return null;
                        }
                        return (
                            <div
                                key={categoryIndex}
                                className={`rounded-xl px-4 pb-4 ${getCategoryColor(category)}`}
                            >
                                <div className={`pt-3 text-xl mb-2`}>{category}</div>
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
                                                className=" bg-white"
                                                border={false}
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
