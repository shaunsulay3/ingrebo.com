import type { VarietyDTO } from "./variety-dto";

export interface UserIngredientDTO {
    id?: string;
    name: string;
    selectedVariety: VarietyDTO;
    varieties: VarietyDTO[];
}
