import { useQuery } from "@tanstack/react-query";
import { getSavedRecipes } from "../../api/recipe-api";
import RecipeThumbnail from "../../features/recipes/components/RecipeThumbnail";
import ErrorPage from "./ErrorPage";

export default function SavePage() {
    const { data, isFetching } = useQuery({
        queryKey: ["saved recipes"],
        queryFn: () => getSavedRecipes(),
        retry: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
    if (isFetching) {
        return <div>Loading...</div>;
    }
    if (!data) {
        return <ErrorPage />;
    }
    return (
        <div className="px-10 py-8">
            <h1>Your Saved Recipes</h1>
            <div className="columns-[250px]">
                {data.map((r) => (
                    <div className="w-full break-inside-avoid mb-4">
                        <RecipeThumbnail key={r.id} recipeThumbnail={r} />
                    </div>
                ))}
            </div>
        </div>
    );
}
