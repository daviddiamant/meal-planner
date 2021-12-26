import { recipesDAL } from "../../common/DAL";
import { getAmountInBook, getBook } from "./DAL";

export const getRecipe = async (bookID, slug) => {
  const { getRecipeBySlug } = recipesDAL();

  const recipe = await getRecipeBySlug(bookID, slug);

  return recipe;
};

export const getBookPaginated = async (
  bookID,
  from = 0,
  to = Number.MAX_SAFE_INTEGER
) => {
  const recipes = await getBook(bookID, from, to);

  const amountInTotal = await getAmountInBook(bookID);

  return { recipes, hasMoreRecipes: amountInTotal > to };
};
