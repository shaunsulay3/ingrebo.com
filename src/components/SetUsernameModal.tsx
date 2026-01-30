import { useState } from "react";
import InputBox from "./InputBox";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { changeUsername } from "../api/user-api";
import type { AxiosError } from "axios";

export default function SetUsernameModal({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const [username, setUsername] = useState<string>("");
    const usernameRegex = /^(?!.*\.\.)(?!\.)(?!.*\.$)[a-zA-Z0-9._]{4,24}$/;
    const handleSave = async () => {
        if (username.trim() === "") {
            toast.error("Username cannot be empty");
            return;
        }
        if (username.length < 4) {
            toast.error("Username must be at least 4 characters long");
            return;
        }
        if (username.length > 24) {
            toast.error("Username cannot be longer than 24 characters");
            return;
        }
        if (usernameRegex.test(username) === false) {
            toast.error(
                `Username must be between 4 and 24 characters long and only contain letters, numbers, dots, and underscores, and cannot start or end with a dot or have consecutive dots`
            );
        }
        mutation.mutate(username);
    };
    const mutation = useMutation({
        mutationFn: changeUsername,
        onSuccess: () => {
            toast.success(`"Welcome to ingrebo ${username}!"`);
            onClose();
        },
        onError: (error) => {
            const axiosError = error as AxiosError<any>;
            if (axiosError.response?.status === 409) {
                toast.error("Sorry. That username is already taken. Please choose another one.");
                return;
            }
            toast.error("An error occurred while changing username. Please try again later.");
        },
    });
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
                <h2 className="mb-2 text-xl font-semibold">Start with a name!</h2>
                <p className="mb-4 text-sm text-gray-500">
                    This name will be visible to other users.
                </p>
                <InputBox
                    className="mb-4 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    onChange={(value) => setUsername(value)}
                    maxChars={24}
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave()}
                        className="rounded-md bg-green-800 px-4 py-2 text-sm text-white hover:bg-green-900 cursor-pointer"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
