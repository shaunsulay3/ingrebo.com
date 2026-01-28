import type { RecipeIngredientDTO } from "../types/recipe-ingredient-dto";
import type { RecipeIngredientLineDTO } from "../types/recipe-ingredient-line-dto";
import RecipeIngredient from "./RecipeIngredient";

type RecipeIngredientLineProps = {
    isAuthenticated: boolean;
    recipeIngredientLineDTO: RecipeIngredientLineDTO;
    onToggleOpenRecipeIngredient: (id: string) => void;
    openRecipeIngredientId: string;
};

export default function RecipeIngredientLine({
    isAuthenticated,
    recipeIngredientLineDTO,
    onToggleOpenRecipeIngredient,
    openRecipeIngredientId,
}: RecipeIngredientLineProps) {
    const line = recipeIngredientLineDTO.line;
    const recipeIngredients = recipeIngredientLineDTO.recipeIngredients;
    const sortedRecipeIngredients = recipeIngredients.sort(
        (a, b) => a.ingredientIndex.start - b.ingredientIndex.start
    );
    let lastIndex = 0;
    let sentenceParts: string[] = [];
    let ingredientParts: { name: string; recipeIngredient: RecipeIngredientDTO }[] = [];
    for (const recipeIngredient of sortedRecipeIngredients) {
        const startIndex = recipeIngredient.ingredientIndex.start;
        const endIndex = recipeIngredient.ingredientIndex.end;
        sentenceParts.push(line.slice(lastIndex, startIndex));
        ingredientParts.push({
            name: line.slice(startIndex, endIndex),
            recipeIngredient: recipeIngredient,
        });
        lastIndex = endIndex;
    }
    return (
        <div className="mb-1">
            {sentenceParts.map((sentencePart, index) => {
                return (
                    <span>
                        {sentencePart}
                        <RecipeIngredient
                            key={index}
                            name={ingredientParts[index].name}
                            recipeIngredientDTO={ingredientParts[index].recipeIngredient}
                            onToggleOpen={(id) => onToggleOpenRecipeIngredient(id)}
                            openRecipeIngredientId={openRecipeIngredientId}
                            isAuthenticated={isAuthenticated}
                        />
                    </span>
                );
            })}
        </div>
    );
}
