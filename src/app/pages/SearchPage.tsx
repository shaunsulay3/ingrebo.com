import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { searchRecipe } from "../../api/recipe-api";
import RecipeThumbnail from "../../features/recipes/components/RecipeThumbnail";
import { useByMatch } from "../../contexts/ByMatchContext";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const { byMatch } = useByMatch();
    const q = searchParams.get("q");
    if (!q || q.trim() === "") {
    }
    const { data, isFetching } = useQuery({
        queryKey: ["searchRecipes", byMatch, q],
        queryFn: () => {
            return searchRecipe(q ?? "", byMatch);
        },
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
    if (isFetching) {
        return (
            <div>
                <LoadingPage />
            </div>
        );
    }
    if (!data) {
        return <ErrorPage />;
    }
    return (
        <div className="px-10 ">
            {data.length === 0 ? (
                <div>No results found.</div>
            ) : (
                <div>
                    {byMatch ? (
                        <div>
                            <div className="text-green-800 mb-4 border-b-2 border-gray-200 text-3xl p-4">
                                Showing Matches for <b>{q}</b>
                            </div>
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 items-center">
                                {data.map((r) => (
                                    <RecipeThumbnail key={r.id} recipeThumbnail={r} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className=" mb-4 border-b-2 border-gray-200 text-3xl p-4">
                                Results for <b>{q}</b>
                            </div>
                            <div className="columns-[250px]">
                                {data.map((r) => (
                                    <div className="w-full break-inside-avoid mb-4">
                                        <RecipeThumbnail key={r.id} recipeThumbnail={r} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
