import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ByMatchProvider } from "../contexts/ByMatchContext";

const queryClient = new QueryClient();
function Providers({ children }: { children: React.ReactNode }) {
    return (
        <BrowserRouter>
            <ByMatchProvider>
                <AuthProvider>
                    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
                </AuthProvider>
            </ByMatchProvider>
        </BrowserRouter>
    );
}

export default Providers;
