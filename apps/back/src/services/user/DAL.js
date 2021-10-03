import { getDB } from "../../common/db";
import { getUserPublicFieldsProjection } from "./projections";

export const getUserPublicFields = async (uID) => {
  const db = await getDB(process.env.USERS_DB);
  const findRes = await db
    .collection("users")
    .find({ uID })
    .project(getUserPublicFieldsProjection)
    .next();

  return findRes;
};
