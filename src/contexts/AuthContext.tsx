// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../features/auth/types/user";
import { api } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { logout as logoutApi, me } from "../api/auth-api";
type AuthContextType = {
    user: User | null;
    login: () => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();
    const login = async () => await initialize();
    const logout = async () => {
        await logoutApi();
        initialize();
        navigate("/");
    };

    // (optional) Try to restore session on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
        initialize();
    }, []);

    const initialize = async () => {
        try {
            const sessionUser = await me();
            if (!user || user.username !== sessionUser.username) {
                setUser(sessionUser);
            }
        } catch (error) {
            setUser(null);
        }

        api.interceptors.response.use(
            (res) => res,
            (err) => {
                if (err.response?.status === 401) {
                    setUser(null);
                    navigate("/login");
                }
                return Promise.reject(err);
            }
        );
    };

    // (optional) Keep user in localStorage for refresh persistence
    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside an AuthProvider");
    return context;
}
