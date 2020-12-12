import { getDB } from "../../common/db";
import { recipeForListsProjection } from "../../common/projections";

const recipesCollection = "recipes";

export const getBook = async (bookID) => {
  const db = await getDB(process.env.RECIPES_DB);
  const findRes = await db
    .collection(recipesCollection)
    .find({ bookID })
    .project(recipeForListsProjection)
    .toArray();

  return findRes;
};
