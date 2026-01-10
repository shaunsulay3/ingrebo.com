import type { VarietyDTO } from "./variety-dto";

export interface IngredientDTO {
    name: string;
    selectedVariety: VarietyDTO;
}
