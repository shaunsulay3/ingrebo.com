import { api } from "../lib/axios";

export const changeUsername = async (newUsername: string): Promise<void> => {
    await api.patch("/users/username", { newUsername: newUsername });
};
