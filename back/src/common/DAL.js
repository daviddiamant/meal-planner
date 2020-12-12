import { ObjectID } from "mongodb";

import { getDB } from "./db";
import {
  recipeForListsProjection,
  singleRecipeProjection,
} from "./projections";

export const recipesDAL = () => ({
  updateRecipe: async (recipeId, set) => {
    const db = await getDB(process.env.RECIPES_DB);
    await db.collection("recipes").updateOne(
      { _id: ObjectID(recipeId) },
      {
        $set: set,
      }
    );
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
