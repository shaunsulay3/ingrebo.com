import { useRef, type ChangeEvent, forwardRef, useEffect } from "react";

const TextAreaBox = forwardRef<
    HTMLTextAreaElement,
    {
        placeholder?: string;
        onChange: (value: string) => void;
        className?: string;
        value?: string;
        maxLength?: number;
        onEnter?: () => void;
        onBackspace?: () => void;
    }
>(
    (
        { placeholder = "", onChange, className, value, maxLength = 2000, onEnter, onBackspace },
        ref
    ) => {
        const innerRef = useRef<HTMLTextAreaElement>(null);

        const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
            onChange(e.target.value);
            const el = innerRef.current;
            if (el) {
                el.style.height = "auto";
                el.style.height = `${el.scrollHeight}px`;
            }
        };
        const resize = () => {
            const el = innerRef.current;
            if (el) {
                el.style.height = "auto"; // reset first
                el.style.height = `${el.scrollHeight}px`; // then set to scrollHeight
            }
        };
        useEffect(() => {
            resize();
        }, [value]);

        return (
            <textarea
                maxLength={maxLength}
                ref={(el) => {
                    innerRef.current = el;
                    if (typeof ref === "function") ref(el);
                    else if (ref) ref.current = el;
                }}
                placeholder={placeholder}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden ${className}`}
                onChange={handleChange}
                value={value}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && onEnter) {
                        e.preventDefault();
                        onEnter();
                        return;
                    }
                    if (e.key === "Backspace" && !e.shiftKey && onBackspace) {
                        onBackspace();
                        return;
                    }
                }}
            />
        );
    }
);

export default TextAreaBox;
