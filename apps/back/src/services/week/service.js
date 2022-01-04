import { recipesDAL } from "../../common/DAL";
import {
  addToWeek as addToWeekDAL,
  countInWeek,
  removeFromWeek as removeFromWeekDAL,
} from "./DAL";

export const addToWeek = async (weekID, bookID, slug) => {
  const { getRecipeBySlug } = recipesDAL();

  const recipe = await getRecipeBySlug(bookID, slug, true);
  if (!recipe) {
    return false;
  }

  const previousCount = await countInWeek(weekID, slug);
  if (previousCount > 0) {
    return false;
  }

  const inserted = await addToWeekDAL({
    ...recipe,
    weekID,
  });

  return !!inserted?.insertedId;
};

export const removeFromWeek = async (weekID, slug) => {
  const removed = await removeFromWeekDAL(slug, weekID);

  return removed.deletedCount > 0;
};
