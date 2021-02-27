import { getDB } from "../../common/db";
import { getUserProjection } from "./projections";

export const getUser = async (uID) => {
  const db = await getDB(process.env.USERS_DB);
  const findRes = await db
    .collection("users")
    .find({ uID })
    .project(getUserProjection)
    .next();

  return findRes;
};
