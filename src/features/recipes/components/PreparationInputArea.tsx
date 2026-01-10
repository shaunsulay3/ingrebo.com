import { useEffect, useState } from "react";
import TextAreaBox from "../../../components/TextAreaBox";
import MinusCircleIcon from "../../../components/icons/MinusCircleIcon";

export default function PreparationInputArea({
    onChange,
}: {
    onChange: (value: string[]) => void;
}) {
    const [steps, setSteps] = useState<string[]>(["", "", ""]);

    useEffect(() => {
        onChange(steps);
    }, [steps]);
    function handleChange(value: string, index: number) {
        setSteps((prev) => {
            const newSteps = [...prev];
            newSteps[index] = value;
            return newSteps;
        });
    }
    function handleAddStep(index: number) {
        if (index === 0) {
            setSteps((prev) => {
                return ["", ...prev];
            });
            return;
        }
        setSteps((prev) => {
            return [...prev.slice(0, index + 1), "", ...prev.slice(index + 1)];
        });
    }
    function handleDeleteStep(index: number) {
        if (steps.length === 1) {
            return;
        }
        setSteps((prev) => {
            return prev.filter((_, i) => i !== index);
        });
    }
    return (
        <div>
            {steps.map((step, index) => {
                const placeholder =
                    index === 0
                        ? "Ex: Begin with washing the cabbages and cutting into big chunks"
                        : undefined;
                return (
                    <PreparationStep
                        key={`prepstep-${index}`}
                        index={index}
                        onChange={handleChange}
                        onAddStep={handleAddStep}
                        onDelete={handleDeleteStep}
                        placeholder={placeholder}
                        value={step}
                    />
                );
            })}
        </div>
    );
}

function PreparationStep({
    placeholder,
    index,
    onChange,
    onAddStep,
    onDelete,
    value,
}: {
    placeholder?: string;
    index: number;
    onChange: (value: string, index: number) => void;
    onDelete: (index: number) => void;
    onAddStep: (index: number) => void;
    value: string;
}) {
    return (
        <div>
            {index === 0 && (
                <div
                    className="w-full min-h-2 cursor-pointer hover:text-black duration-300 text-white text-xs"
                    onClick={() => onAddStep(index)}
                >
                    Add step..
                </div>
            )}
            <div className="flex">
                <div className="w-6 mt-2 mr-2">
                    <h4>{index + 1}.</h4>
                </div>
                <TextAreaBox
                    placeholder={placeholder}
                    onChange={(value) => {
                        onChange(value, index);
                    }}
                    className="border-gray-400"
                    value={value}
                />
                <div className="ml-4 w-10 mt-3">
                    <MinusCircleIcon
                        className="text-gray-400 cursor-pointer hover:text-red-500 duration-300"
                        onClick={() => {
                            onDelete(index);
                        }}
                    />
                </div>
            </div>
            <div
                className="w-full min-h-2 cursor-pointer hover:text-black duration-300 text-white text-xs"
                onClick={() => onAddStep(index)}
            >
                Add step..
            </div>
        </div>
    );
}
