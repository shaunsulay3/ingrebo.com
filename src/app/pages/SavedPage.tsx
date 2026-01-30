import { useQuery } from "@tanstack/react-query";
import { getSavedRecipes } from "../../api/recipe-api";
import RecipeThumbnail from "../../features/recipes/components/RecipeThumbnail";
import ErrorPage from "./ErrorPage";
import SoEmpty from "../../components/SoEmpty";
import LoadingPage from "./LoadingPage";

export default function SavePage() {
    const { data, isFetching } = useQuery({
        queryKey: ["saved recipes"],
        queryFn: () => getSavedRecipes(),
        retry: false,
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
        <div className="px-16 mt-8">
            <h1>Your Saved Recipes</h1>
            {data.length === 0 && <SoEmpty className="my-40" />}
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
