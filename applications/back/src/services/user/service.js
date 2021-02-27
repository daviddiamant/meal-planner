import { getClient } from "../../common/algolia";
import { getUserPublicFields } from "./DAL";

export const getUser = async (uid) => {
  const user = await getUserPublicFields(uid);
  const client = getClient();

  const usersAlgoliaPublicKey = client.generateSecuredApiKey(
    process.env.ALGOLIA_SEARCH_KEY,
    {
      filters: `bookID:${user.bookID}`,
    }
  );

  return {
    ...user,
    algoliaSearchKey: usersAlgoliaPublicKey,
  };
};
