import { recommendRecipes } from "../../api/recipe-api";
import RecipeThumbnail from "../../features/recipes/components/RecipeThumbnail";
import { useByMatch } from "../../contexts/ByMatchContext";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";
function ExplorePage() {
    const { byMatch } = useByMatch();
    const { data, isFetching, error } = useQuery({
        queryKey: ["recommended-recipes", byMatch],
        queryFn: () => recommendRecipes(byMatch),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
    if (isFetching) {
        return <div>Loading...</div>;
    }
    if (!data) {
        if (error) {
            return <ErrorPage />;
        }
        return <div>No data</div>;
    }
    return (
        <div className="px-4">
            {byMatch ? (
                <div>
                    <div className="text-green-800 mb-4 border-b-2 border-gray-200 text-3xl bold p-4">
                        Showing Matches
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
                        Popular Recipes
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
    );
}

export default ExplorePage;
