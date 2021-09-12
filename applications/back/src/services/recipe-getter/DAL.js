import { getDB } from "../../common/db";
import { recipeForListsProjection } from "../../common/projections";

const recipesCollection = "recipes";

export const getBook = async (
  bookID,
  from = 0,
  to = Number.MAX_SAFE_INTEGER
) => {
  const db = await getDB(process.env.RECIPES_DB);
  const findRes = await db
    .collection(recipesCollection)
    .find({ bookID })
    .skip(from)
    .limit(to - from)
    .project(recipeForListsProjection)
    .toArray();

  return findRes;
};
