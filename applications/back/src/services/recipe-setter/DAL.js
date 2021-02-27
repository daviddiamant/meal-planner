import { getFilteredRecipe, getIndex } from "../../common/algolia";
import { getDB } from "../../common/db";

const collection = "recipes";

export const alreadyAdded = async (bookID, url) => {
  const db = await getDB(process.env.RECIPES_DB);
  const findRes = await db
    .collection(collection)
    .find({ bookID, url })
    .toArray();

  return findRes.length > 0;
};

export const alreadyAddedBySlug = async (bookID, slug) => {
  const db = await getDB(process.env.RECIPES_DB);
  const findRes = await db
    .collection(collection)
    .find({ bookID, slug })
    .toArray();

  return findRes.length > 0;
};

export const saveRecipe = async (recipe) => {
  const db = await getDB(process.env.RECIPES_DB);
  const added = await db.collection(collection).insertOne(recipe);

  const filteredRecipe = getFilteredRecipe(recipe);
  filteredRecipe["objectID"] = added.insertedId;

  const index = getIndex(process.env.ALGOLIA_RECIPE_INDEX);
  await index.saveObject(filteredRecipe);

  return added;
};
