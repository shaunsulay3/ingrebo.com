import type { NutrientFactsDTO } from "../types/nutrient-facts-dto";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
type RecipeNutrientFactsProps = {
    nutrientFactsDTO: NutrientFactsDTO;
};

export default function RecipeMacroNutrients({ nutrientFactsDTO }: RecipeNutrientFactsProps) {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    const macros = [
        {
            name: "Protein",
            value: nutrientFactsDTO.protein?.amount ?? 0,
        },
        {
            name: "Carbohydrates",
            value: nutrientFactsDTO.totalCarbohydrate?.amount ?? 0,
        },
        {
            name: "Fat",
            value: nutrientFactsDTO.totalFat?.amount ?? 0,
        },
    ];
    return (
        <div className="px-8 py-4 min-w-full min-h-full items-center">
            <div className="font-extrabold text-2xl mb-3">Macros</div>
            <div className="w-full h-60">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={macros}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius="100%"
                            fill="#8884d8"
                        >
                            {macros.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
