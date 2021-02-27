import { recipesDAL } from "../../common/DAL";

export const getRecipe = async (bookID, slug) => {
  const { getRecipeBySlug } = recipesDAL();

  const recipe = await getRecipeBySlug(bookID, slug);

  return recipe;
};
