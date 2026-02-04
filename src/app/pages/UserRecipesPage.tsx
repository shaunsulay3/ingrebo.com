import { useQuery } from "@tanstack/react-query";
import { getUserRecipes } from "../../api/recipe-api";
import RecipeThumbnail from "../../features/recipes/components/RecipeThumbnail";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import ErrorPage from "./ErrorPage";
import SoEmpty from "../../components/SoEmpty";
import LoadingPage from "./LoadingPage";
import ShareButton from "../../components/ShareButton";

export function UserRecipesPage() {
    const { slug } = useParams();
    const { data, error, isPending } = useQuery({
        queryKey: ["user-recipes", slug],
        queryFn: () => getUserRecipes(slug ?? ""),
        retry: false,
    });
    if (isPending) {
        return (
            <div>
                <LoadingPage />
            </div>
        );
    }

    if (!data) {
        if (error instanceof AxiosError && error.response?.status === 404) {
            return <ErrorPage message="We couldn't fight what you were looking for" />;
        }
        return <ErrorPage />;
    }
    return (
        <div className="px-16 mt-8">
            <div className="flex items-center mb-4">
                <h1 className="!m-0">{data.username}'s Recipes</h1>
                <ShareButton
                    onClickText={`${data.username}'s recipe page copied to clipboard!`}
                    copy={`${window.location.origin}/${slug}`}
                    className="ml-6"
                />
            </div>
            {data.recipeThumbnails.length === 0 && <SoEmpty className="my-40" />}
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
