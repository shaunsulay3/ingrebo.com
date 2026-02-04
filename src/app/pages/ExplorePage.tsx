import { recommendRecipes } from "../../api/recipe-api";
import RecipeThumbnail from "../../features/recipes/components/RecipeThumbnail";
import { useByMatch } from "../../contexts/ByMatchContext";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";
import { useState } from "react";
import SetUsernameModal from "../../components/SetUsernameModal";
import { useNavigate, useSearchParams } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useAuth } from "../../contexts/AuthContext";
function ExplorePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const newUser = searchParams.has("newUser");
    const { byMatch } = useByMatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { setByMatch } = useByMatch();
    const { data, isFetching, error } = useQuery({
        queryKey: ["recommended-recipes", byMatch],
        queryFn: () => recommendRecipes(byMatch),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    return (
        <div className="px-4">
            <SetUsernameModal
                open={newUser}
                onClose={() => {
                    window.location.href = "/";
                }}
            />
            <div>
                <div className="mb-4 border-b-2 border-gray-200 bold p-4">
                    <span
                        className={`mr-8 ${
                            !byMatch
                                ? "text-green-800 text-3xl"
                                : "text-gray-300 text-2xl cursor-pointer hover:text-gray-400 duration:200"
                        }`}
                        onClick={() => {
                            setByMatch(false);
                        }}
                    >
                        Popular
                    </span>
                    <span
                        className={`${
                            byMatch
                                ? "text-green-800 text-3xl"
                                : "text-gray-300 text-2xl cursor-pointer hover:text-gray-400 duration:200"
                        }`}
                        onClick={() => {
                            if (!isAuthenticated) {
                                navigate("/login");
                                return;
                            }
                            setByMatch(true);
                        }}
                    >
                        Matches for you
                    </span>
                </div>
                {isFetching ? (
                    <div className="flex items-center justify-center">
                        <div>
                            <LoadingPage />
                        </div>
                    </div>
                ) : error || !data ? (
                    <ErrorPage />
                ) : (
                    <div>
                        {byMatch ? (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 items-center">
                                {data.map((r) => (
                                    <RecipeThumbnail key={r.id} recipeThumbnail={r} />
                                ))}
                            </div>
                        ) : (
                            <div className="columns-[250px]">
                                {data.map((r) => (
                                    <div className="w-full break-inside-avoid mb-4">
                                        <RecipeThumbnail key={r.id} recipeThumbnail={r} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="h-20" />
        </div>
    );
}

export default ExplorePage;
