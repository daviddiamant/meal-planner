export type { RecipeInIndex } from "./algolia";
import type { Palette } from "./palette";
import type { Ingredient, Instruction } from "./recipe";

export enum Paths {
  AddRecipe = "/recipes/add",
  AddToWeek = "/week/add",
  Recipe = "/recipes/:slug",
  Recipes = "/recipes/:from/:to",
  RemoveFromWeek = "/week/remove",
  UserConfig = "/user",
  Week = "/week",
}

export interface Responses {
  Recipe: {
    screenshot: string;
    smallImage: string;
    smallImageWidth: number;
    smallImageHeight: number;
    image: string;
    imageWidth: number;
    imageHeight: number;
    imagePalette: Palette;
    title: string;
    description: string;
    ingredients: Ingredient[];
    instructions: Instruction | Instruction[];
    url: string;
  };
  Recipes: {
    recipes: {
      title: string;
      slug: string;
      url: string;
      smallImage: string;
      smallImageWidth: number;
      smallImageHeight: number;
      mediumImage: string;
      mediumImageWidth: number;
      mediumImageHeight: number;
    }[];
    hasMoreRecipes: boolean;
  };
  UserConfig: {
    algoliaSearchKey: string;
    bookID: string;
    bookTitle: string;
    lowTitle: boolean;
  };
  Week: {
    title: string;
    url: string;
    slug: string;
    mediumImage: string;
    mediumImageHeight: number;
    mediumImageWidth: number;
    smallImage: string;
    smallImageHeight: number;
    smallImageWidth: number;
    weekID: string;
  }[];
}
