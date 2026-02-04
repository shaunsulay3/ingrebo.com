import { Share } from "lucide-react";
import toast from "react-hot-toast";

export default function ShareButton({
    onClickText,
    copy,
    className,
}: {
    onClickText: string;
    copy: string;
    className?: string;
}) {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(copy);
            toast.success(onClickText);
        } catch (err) {
            toast.error("Failed to copy to clipboard");
        }
    };
    return (
        <button
            className={`${className} flex border-1 rounded-2xl px-2 py-1 items-center border-gray-300 text-gray-500 cursor-pointer hover:bg-gray-200 hover:text-gray-600`}
            onClick={handleCopy}
        >
            <span className="pr-1">Share</span>
            <Share className="w-4" />
        </button>
    );
}
