import axios from "axios";
import toast from "react-hot-toast";

let onSessionExpired: (() => void) | null = null;

export function setSessionExpiredHandler(fn: () => void) {
    onSessionExpired = fn;
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const ignore401 = err.config?.meta?.ignore401;
        if (err.response?.status === 401 && !ignore401) {
            onSessionExpired?.();
        }
        if (err.response?.status === 500) {
            toast.error("Uh oh.. Something broke on our end. Please try again later.");
        }
        return Promise.reject(err);
    }
);
