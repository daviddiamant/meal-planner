import type { Palette } from "./palette";
import type { Ingredient, Instruction } from "./recipe";

export enum Paths {
  UserConfig = "/user",
  Recipe = "/recipes/:slug",
  Recipes = "/recipes/:from/:to",
}

export interface Responses {
  UserConfig: {
    algoliaSearchKey: string;
    bookID: string;
    bookTitle: string;
    lowTitle: boolean;
  };
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
}
