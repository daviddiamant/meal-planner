import { getDB } from "../../common/db";
import { getAllProjcetion } from "./projections";

export const getWeek = async (weekID) => {
  const db = await getDB(process.env.WEEK_DB);
  const findRes = await db
    .collection("planned")
    .find({ weekID })
    .project(getAllProjcetion)
    .toArray();

  return findRes;
};

export const addToWeek = async (recipe) => {
  const db = await getDB(process.env.WEEK_DB);
  const added = await db.collection("planned").insertOne(recipe);

  return added;
};

export const removeFromWeek = async (slug, weekID) => {
  const db = await getDB(process.env.WEEK_DB);
  const removed = await db.collection("planned").deleteOne({
    $and: [{ slug }, { weekID }],
  });

  return removed;
};
