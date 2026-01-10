import { useRef, type ChangeEvent } from "react";

function TextAreaBox({
    placeholder = "",
    onChange,
    className,
    value,
    maxLength = 2000,
}: {
    placeholder?: string;
    onChange: (value: string) => void;
    className?: string;
    value?: string;
    maxLength?: number;
}) {
    const ref = useRef<HTMLTextAreaElement>(null);
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value); // call parent callback if provided
        const el = ref.current;
        if (el) {
            el.style.height = "auto"; // reset height
            el.style.height = `${el.scrollHeight}px`; // set height to content
        }
    };
    return (
        <textarea
            maxLength={maxLength}
            ref={ref}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-hidden ${className}`}
            onChange={handleChange}
            value={value}
        ></textarea>
    );
}

export default TextAreaBox;
