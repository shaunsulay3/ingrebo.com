import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ContinueWithGoogle from "../../components/ContinueWithGoogle";

function LoginPage() {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    if (isAuthenticated) {
        navigate("/");
    }

    return (
        <div className="relative h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-[url('/wallpaper.png')] bg-[length:200%] bg-center w-full"
                style={{ backgroundAttachment: "fixed" }}
            ></div>
            <div className="absolute inset-0 bg-green-100/70"></div>
            <div className="relative z-10 w-1/3 min-w-80 h-full px-[5%] bg-white text-green-800 overflow-y-auto max-h-screen flex flex-col justify-center">
                <img src="/logo.svg" alt="Logo" className="w-50" />

                <div className="text-2xl mb-5">
                    Create an account or log into an existing one with Google.
                </div>
                <ContinueWithGoogle className="h-20 w-[70%] text-4xl mb-4" />
                <a
                    className="h-15 border rounded-md border-gray-300 flex items-center justify-center text-sm"
                    href={isAuthenticated ? "/" : "/explore"}
                >
                    <div className="text-center">Continue without an account</div>
                </a>
            </div>
        </div>
    );
}

export default LoginPage;
