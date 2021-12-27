import { Responses } from "@meal-planner/types";

export type Recipe = Responses["Recipes"]["recipes"][number] & {
  calculatedHeight?: number;
  calculatedWidth?: number;
};
