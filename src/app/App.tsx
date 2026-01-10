import { Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "../components/Layout";
import RecipePage from "./pages/RecipePage";
import CreateRecipePage from "./pages/CreateRecipePage";
import LoginPage from "./pages/LoginPage";
import { UserRecipesPage } from "./pages/UserRecipesPage";
import MyIngredientsPage from "./pages/MyIngredientsPage";
import SignUpPage from "./pages/SignUpPage";
import SearchPage from "./pages/SearchPage";
import SavePage from "./pages/SavedPage";
import ExplorePage from "./pages/ExplorePage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<ExplorePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/saved" element={<SavePage />} />
                <Route path="/:authorslug/:slug" element={<RecipePage />} />
                <Route path="/create" element={<CreateRecipePage />} />
                <Route path="/:slug" element={<UserRecipesPage />} />
                <Route path="/my-ingredients" element={<MyIngredientsPage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
        </Routes>
    );
}

export default App;
