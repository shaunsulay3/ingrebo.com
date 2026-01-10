import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { register } from "../../api/auth-api";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function SignUpPage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        navigate("/");
    }
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            // use react query instead
            await register(username, password);
            if (errorMessage) {
                setErrorMessage(null);
            }
            navigate("/login");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setErrorMessage(error.response.data.message);
                return;
            }
            throw error;
        }
    };

    return (
        <div className="relative">
            <div className="absolute top-0 left-0 z-20 h-50 w-full p-6 bg-gradient-to-b from-white/100 to-transparent">
                <a href="/" className="items-center">
                    <img src="/logo.svg" alt="Logo" className="w-50" />
                </a>
            </div>
            <div className="absolute inset-0 bg-[url('/wallpaper.png')] bg-[length:200%] bg-center w-full"></div>
            <div className="absolute inset-0 bg-white/70"></div>
            <div className="relative z-10 border-red-500 flex items-center justify-center min-h-screen">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
                >
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-1 font-medium">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setUsername(e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block mb-1 font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                            }
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                        Sign Up
                    </button>
                    <div className="text-center mt-3 text-sm">
                        <span>Already have an account? </span>
                        <Link to={"/login"}>
                            {" "}
                            <span className="text-blue-500">Log in</span>
                        </Link>
                    </div>
                    {errorMessage && (
                        <p className="text-red-400">
                            <i>{errorMessage}</i>
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;
