import { ObjectId } from "mongodb";

import { getFilteredRecipe, getIndex } from "./algolia";
import { getDB } from "./db";
import {
  recipeForListsProjection,
  singleRecipeProjection,
} from "./projections";

export const recipesDAL = () => ({
  updateRecipe: async (recipeId, set) => {
    const db = await getDB(process.env.RECIPES_DB);
    await db.collection("recipes").updateOne(
      { _id: ObjectId(recipeId) },
      {
        $set: set,
      }
    );

    const filteredSet = getFilteredRecipe(set);
    filteredSet["objectID"] = recipeId;

    const index = getIndex(process.env.ALGOLIA_RECIPE_INDEX);
    await index.partialUpdateObject(filteredSet);
  },
  getRecipeBySlug: async (bookID, slug, listProjection = false) => {
    const db = await getDB(process.env.RECIPES_DB);
    const findRes = await db
      .collection("recipes")
      .find({ bookID, slug })
      .project(
        listProjection ? recipeForListsProjection : singleRecipeProjection
      )
      .next();

    return findRes;
  },
});
