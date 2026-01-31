import { useEffect, useState, useRef } from "react";
import TextAreaBox from "../../../components/TextAreaBox";
import MinusCircleIcon from "../../../components/icons/MinusCircleIcon";
import { PlusCircle } from "lucide-react";
import { forwardRef } from "react";
export default function PreparationInputArea({
    initialSteps,
    onChange,
}: {
    initialSteps?: string[];
    onChange: (value: string[]) => void;
}) {
    const [steps, setSteps] = useState<string[]>(initialSteps ?? ["", "", ""]);
    const refs = useRef<(HTMLTextAreaElement | null)[]>([]);

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

    function handleAddStep(index: number, byEnter: boolean) {
        setSteps((prev) => {
            let newSteps = prev;
            if (index === prev.length - 1 || !byEnter) {
                newSteps = [...prev.slice(0, index + 1), "", ...prev.slice(index + 1)];
            }
            // Focus the next textarea after DOM updates
            setTimeout(() => {
                refs.current[index + 1]?.focus();
            }, 0);

            return newSteps;
        });
    }

    function handleDeleteStep(index: number, focusBack?: boolean) {
        if (steps.length === 1) return;

        if (focusBack) {
            setTimeout(() => {
                refs.current[index - 1]?.focus();
            }, 0);
        }
        setSteps((prev) => prev.filter((_, i) => i !== index));
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
                        ref={(el: HTMLTextAreaElement | null) => {
                            refs.current[index] = el;
                        }}
                    />
                );
            })}
        </div>
    );
}

const PreparationStep = forwardRef<
    HTMLTextAreaElement,
    {
        placeholder?: string;
        index: number;
        onChange: (value: string, index: number) => void;
        onDelete: (index: number, focusBack?: boolean) => void;
        onAddStep: (index: number, byEnter: boolean) => void;
        value: string;
    }
>(({ placeholder, index, onChange, onAddStep, onDelete, value }, ref) => {
    return (
        <div>
            {index === 0 && (
                <div
                    className="w-full group min-h-6 cursor-pointer text-black text-xs flex justify-center items-center"
                    onClick={() => onAddStep(index, false)}
                >
                    <div className="h-[2px] w-full mx-20 bg-gray-200 group-hover:bg-green-800 duration-150 flex justify-center items-center">
                        <PlusCircle className="bg-white h-4 text-gray-300 group-hover:text-green-800" />
                    </div>
                </div>
            )}
            <div className="flex">
                <div className="w-6 mt-2 mr-2">
                    <h4>{index + 1}.</h4>
                </div>
                <TextAreaBox
                    placeholder={placeholder}
                    onChange={(value) => onChange(value, index)}
                    onEnter={() => onAddStep(index, true)}
                    onBackspace={() => {
                        if (value.length === 0) {
                            onDelete(index, true);
                        }
                    }}
                    value={value}
                    ref={ref}
                    className="border-gray-400"
                />
                <div className="ml-4 w-10 mt-3">
                    <MinusCircleIcon
                        className="text-gray-400 cursor-pointer hover:text-red-500 duration-300"
                        onClick={() => onDelete(index)}
                    />
                </div>
            </div>
            <div
                className="w-full group min-h-6 cursor-pointer text-black text-xs flex justify-center items-center"
                onClick={() => onAddStep(index, false)}
            >
                <div className="h-[2px] w-full mx-20 bg-gray-200 group-hover:bg-green-800 duration-150 flex justify-center items-center">
                    <PlusCircle className="bg-white h-4 text-gray-300 group-hover:text-green-800" />
                </div>
            </div>
        </div>
    );
});
