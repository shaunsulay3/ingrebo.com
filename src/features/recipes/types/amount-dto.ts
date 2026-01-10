export interface AmountDTO {
    quantity: number;
    quantityMax: number | null;
    unit: string | null;
    text: string;
    isMeasurableUnit: boolean;
}
