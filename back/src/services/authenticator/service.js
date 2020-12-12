import { getUser as getUserDAL } from "./DAL";

export const getUser = async (uid) => {
  const user = await getUserDAL(uid);

  return {
    weekID: user?.weekID || uid,
    bookID: user?.bookID || uid,
  };
};
