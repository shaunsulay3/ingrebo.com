import { useQuery } from "@tanstack/react-query";
import { searchIngredient } from "../../../api/user-ingredient-api";
import { useEffect, useState } from "react";
import type { UserIngredientDTO } from "../types/user-ingredient-dto";
import type { VarietyDTO } from "../types/variety-dto";
import MinusCircleIcon from "../../../components/icons/MinusCircleIcon";
import { set } from "lodash";

type UserIngredientProps = {
    name: string;
    id: string;
    isOpen: boolean;
    userIngredientDTO?: UserIngredientDTO;
    search: boolean;
    className?: string;
    textSize?: number;
    onDelete?: (id: string) => void;
    onUpdateVariety?: (id: string, varietyName: string) => void;
    onToggleOpen?: (id: string) => void;
};

export default function UserIngredient({
    name,
    id,
    isOpen,
    userIngredientDTO,
    search,
    className,
    textSize = 1.25,
    onDelete,
    onUpdateVariety,
    onToggleOpen,
}: UserIngredientProps) {
    const { isPending, error, data } = useQuery({
        queryKey: ["searchIngredient", name],
        queryFn: () => searchIngredient(name),
        enabled: !userIngredientDTO && search,
        retry: false,
        refetchOnWindowFocus: false,
    });
    const [userIngredient, setUserIngredient] = useState<UserIngredientDTO | null>(null);
    const [isChooseVariety, setIsChooseVariety] = useState<boolean>(false);
    const [variety, setVariety] = useState<VarietyDTO | null>(null);
    useEffect(() => {
        if (data) {
            setUserIngredient(data);
            setVariety(data.selectedVariety);
            if (onUpdateVariety) onUpdateVariety(id, data.selectedVariety.name);
        }
    }, [data]);
    useEffect(() => {
        if (isChooseVariety) {
            setIsChooseVariety(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (userIngredientDTO) {
            setUserIngredient(userIngredientDTO);
            setVariety(userIngredientDTO.selectedVariety);
        }
    }, [userIngredientDTO]);
    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div
                className={` ${className} border-2 rounded-2xl cursor-pointer ${
                    userIngredientDTO
                        ? "border-black"
                        : isPending
                        ? "border-gray-400"
                        : error
                        ? "bg-red-500 border border-red-0 text-white"
                        : "bg-green-700 border-0 text-white"
                } `}
                onClick={() => {
                    if (onToggleOpen) onToggleOpen(id);
                }}
                style={{ fontSize: `${textSize ? textSize : "1.125"}rem` }}
            >
                <div className={"px-3 pt-2 pb-1 py-0 leading-none"}>{name}</div>
                <div
                    className={`px-3 min-h-6 leading-none`}
                    style={{ fontSize: `${textSize / 1.5}rem` }}
                >
                    {variety && <i>{variety.name}</i>}
                </div>
            </div>
            {isOpen && (
                <div
                    className={`mt-3 absolute top-full left-0 min-w-60 w-auto border-2 bg-white rounded-2xl z-[9999] ${
                        userIngredient ? "border-green-800" : "border-red-500"
                    }`}
                >
                    {!isChooseVariety && (
                        <div className="flex items-center justify-between pl-5">
                            <div
                                className="my-3 hover:bg-gray-200 duration-200 cursor-pointer"
                                onClick={() => setIsChooseVariety(true)}
                            >
                                {variety ? (
                                    <div>
                                        <div>
                                            <h5 className="!m-0">{variety.name}</h5>
                                        </div>
                                        <div className="text-xs mt-0">
                                            <i>{variety.category}</i>
                                        </div>
                                    </div>
                                ) : (
                                    <h5>We couldn't find the ingredient you were looking for.</h5>
                                )}
                            </div>
                            <div
                                className="self-stretch max-w-[20%] flex items-center justify-center text-red-400 hover:text-red-600 duration-200 cursor-pointer"
                                onClick={() => {
                                    if (onDelete) onDelete(id);
                                }}
                            >
                                <MinusCircleIcon className="w-[60%] h-[60%]" />
                            </div>
                        </div>
                    )}
                    {isChooseVariety && userIngredient && (
                        <div className="py-3">
                            <h5 className="ml-4">Choose a variety:</h5>
                            {userIngredient.varieties.map((variety, i) => {
                                const color = i % 2 === 1 ? "bg-white" : "bg-gray-200";
                                return (
                                    <div
                                        className={`flex items-center justify-between pl-4 pr-2 min-w-100 min-h-8 hover:bg-gray-400 cursor-pointer ${color}`}
                                        key={i}
                                        onClick={() => {
                                            setVariety(variety);
                                            if (onUpdateVariety) onUpdateVariety(id, variety.name);
                                            setIsChooseVariety(false);
                                        }}
                                    >
                                        <div>{variety.name}</div>
                                        <div className="text-xs">
                                            <i>{variety.category}</i>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
