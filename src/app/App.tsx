import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "../components/Layout";
import RecipePage from "./pages/RecipePage";
import CreateRecipePage from "./pages/CreateRecipePage";
import LoginPage from "./pages/LoginPage";
import { UserRecipesPage } from "./pages/UserRecipesPage";
import MyIngredientsPage from "./pages/MyIngredientsPage";
import SearchPage from "./pages/SearchPage";
import SavePage from "./pages/SavedPage";
import ExplorePage from "./pages/ExplorePage";
import WelcomePage from "./pages/WelcomePage";
import { Toaster } from "react-hot-toast";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ExplorePage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/saved" element={<SavePage />} />
                    <Route path="/:authorslug/:slug" element={<RecipePage />} />
                    <Route path="/:slug" element={<UserRecipesPage />} />
                    <Route path="/my-ingredients" element={<MyIngredientsPage />} />
                </Route>
                <Route path="/" element={<Layout showNavbar={false} />}>
                    <Route path="/create" element={<CreateRecipePage />} />
                    <Route
                        path="/:authorslug/:slug/edit"
                        element={<CreateRecipePage edit={true} />}
                    />
                </Route>
                <Route path="/login" element={<LoginPage />} />
            </Routes>
            <Toaster position="top-center" reverseOrder={false} />
        </>
    );
}

export default App;
