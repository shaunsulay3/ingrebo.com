export interface FactFieldDTO {
    amount: number;
    unit: string;
}

export interface NutrientFactsDTO {
    servingSize: FactFieldDTO | null;
    calories: FactFieldDTO | null;
    totalFat: FactFieldDTO | null;
    saturatedFat: FactFieldDTO | null;
    transFat: FactFieldDTO | null;
    cholesterol: FactFieldDTO | null;
    sodium: FactFieldDTO | null;
    totalCarbohydrate: FactFieldDTO | null;
    dietaryFiber: FactFieldDTO | null;
    totalSugars: FactFieldDTO | null;
    addedSugars: FactFieldDTO | null;
    protein: FactFieldDTO | null;
    vitaminD: FactFieldDTO | null;
    calcium: FactFieldDTO | null;
    iron: FactFieldDTO | null;
    potassium: FactFieldDTO | null;
}
