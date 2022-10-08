import { getDB } from "../../common/db";
import { recipeForListsProjection } from "../../common/projections";

const recipesCollection = "recipes";

export const getBook = async (
  bookID,
  from = 0,
  to = Number.MAX_SAFE_INTEGER
) => {
  const db = await getDB(process.env.RECIPES_DB);

  return db
    .collection(recipesCollection)
    .find({ bookID })
    .sort({ _id: -1 })
    .skip(from)
    .limit(to - from)
    .project(recipeForListsProjection)
    .toArray();
};

export const getAmountInBook = async (bookID) => {
  const db = await getDB(process.env.RECIPES_DB);

  return db.collection(recipesCollection).count({ bookID });
};
