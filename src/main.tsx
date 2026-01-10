import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import App from "./app/App.tsx";
import Providers from "./app/Providers.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Providers>
            <App />
        </Providers>
    </StrictMode>
);
