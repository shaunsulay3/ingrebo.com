import { useQuery } from "@tanstack/react-query";
import { getUserRecipes } from "../../api/recipe-api";
import RecipeThumbnail from "../../features/recipes/components/RecipeThumbnail";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import ErrorPage from "./ErrorPage";

export function UserRecipesPage() {
    const { slug } = useParams();
    const { data, error, isPending } = useQuery({
        queryKey: ["user-recipes", slug],
        queryFn: () => getUserRecipes(slug ?? ""),
        retry: false,
    });
    if (isPending) {
        return <div>Loading...</div>;
    }

    if (!data) {
        if (error instanceof AxiosError && error.response?.status === 404) {
            return <ErrorPage message="We couldn't fight what you were looking for" />;
        }
        return <ErrorPage />;
    }
    return (
        <div className="px-10 py-8">
            <h1>{data.username}'s Recipes</h1>
            <div className="columns-[300px]">
                {data.recipeThumbnails.map((r) => (
                    <div className="w-full break-inside-avoid mb-4">
                        <RecipeThumbnail key={r.id} recipeThumbnail={r} />
                    </div>
                ))}
            </div>
        </div>
    );
}
