import type { User } from "../features/auth/types/user";
import { api } from "../lib/axios";

export const login = async (username: string, password: string): Promise<void> => {
    await api.post("/auth/login", { username: username, password: password });
};

export const register = async (username: string, password: string): Promise<void> => {
    await api.post("/auth/register", { username: username, password: password });
};

export const logout = async (): Promise<void> => {
    await api.post("/auth/logout");
};

export const me = async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    console.log(response.data);
    return response.data;
};
