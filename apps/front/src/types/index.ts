import { Responses } from "@meal-planner/types";

export type Recipe = Responses["Recipes"][number] & {
  calculatedHeight?: number;
  calculatedWidth?: number;
};
