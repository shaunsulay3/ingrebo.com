import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
export default function ImageUploader({ onChange }: { onChange: (file: File | null) => void }) {
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const placeholderUrl = "/no-image.jpg"; // your placeholder

    useEffect(() => {
        onChange(originalFile);
    }, [originalFile]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setOriginalFile(file); // ✅ keep original

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;

            img.onload = () => {
                const targetWidth = 800;
                const targetHeight = 600;
                const canvas = document.createElement("canvas");
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                // Crop to 4:3 ratio (center crop)
                const imgRatio = img.width / img.height;
                const targetRatio = targetWidth / targetHeight;
                let cropWidth = img.width;
                let cropHeight = img.height;

                if (imgRatio > targetRatio) {
                    cropWidth = img.height * targetRatio; // too wide → crop sides
                } else {
                    cropHeight = img.width / targetRatio; // too tall → crop top/bottom
                }

                const cropX = (img.width - cropWidth) / 2;
                const cropY = (img.height - cropHeight) / 2;

                ctx.drawImage(
                    img,
                    cropX,
                    cropY,
                    cropWidth,
                    cropHeight,
                    0,
                    0,
                    targetWidth,
                    targetHeight
                );

                const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
                setPreviewUrl(resizedDataUrl);

                // ✅ Convert DataURL → File for upload
                // const resizedFile = dataURLToFile(resizedDataUrl, "resized.jpg");
            };
        };

        reader.readAsDataURL(file);
    };

    // Helper to convert base64 → File
    // const dataURLToFile = (dataUrl: string, filename: string): File => {
    //     const arr = dataUrl.split(",");
    //     const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    //     const bstr = atob(arr[1]);
    //     let n = bstr.length;
    //     const u8arr = new Uint8Array(n);
    //     while (n--) u8arr[n] = bstr.charCodeAt(n);
    //     return new File([u8arr], filename, { type: mime });
    // };

    return (
        <div className="flex flex-col items-center gap-2">
            <input
                id="imageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />

            <label htmlFor="imageInput" className="relative group cursor-pointer">
                <img
                    src={previewUrl || placeholderUrl}
                    alt="Selected"
                    className="w-[300px] h-[225px] object-cover rounded-xl border border-gray-300 shadow"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <span className="text-white text-sm font-medium">Change Photo</span>
                </div>
            </label>

            <p className="text-sm text-gray-600">
                {originalFile ? originalFile.name : "Upload a photo"}
            </p>
        </div>
    );
}
