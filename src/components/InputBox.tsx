import type { ChangeEvent } from "react";
import type { MouseEvent } from "react";
import type { KeyboardEvent } from "react";

interface InputBoxProps {
    maxChars?: number;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    onClick?: (e: MouseEvent) => void;
    onKeyDown?: (e: KeyboardEvent) => void;
    focus?: boolean;
}

function InputBox({
    maxChars = 20,
    value,
    placeholder = "Type here...",
    onChange,
    className,
    onClick,
    onKeyDown,
    focus = true,
}: InputBoxProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!onChange) return;
        onChange(e.target.value); // call parent callback if provided
    };
    return (
        <input
            type="text"
            placeholder={placeholder}
            maxLength={maxChars}
            className={`px-2 py-2 border focus:placeholder-transparent focus:outline-none  ${
                focus ? "focus:ring-1 ring-blue-500" : ""
            }  ${className}`}
            onChange={handleChange}
            onClick={(e) => {
                if (onClick) onClick(e);
            }}
            onKeyDown={(e) => onKeyDown?.(e)}
            {...(value !== undefined ? { value } : {})}
        />
    );
}

export default InputBox;
