import { Palette } from "./palette";
import { Ingredient, Instruction } from "./recipe";

export interface RecipeInIndex {
  url: string;
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  jsonLD: unknown;
  smallImage: string;
  mediumImage: string;
  smallImageWidth: number;
  smallImageHeight: number;
  mediumImageWidth: number;
  mediumImageHeight: number;
  imagePalette?: Palette;
  ingredients?: Ingredient[];
  instructions?: Instruction | Instruction[];
  bookID: string;
}
