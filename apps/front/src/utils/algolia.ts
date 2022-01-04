import algoliasearch, { SearchIndex } from "algoliasearch/lite";

import { ALGOLIA_APP_ID } from "../appConfig";

const index = new Map<string, SearchIndex>();

export const getAlgoliaIndex = (searchKey: string): SearchIndex => {
  if (!index.has(searchKey)) {
    const client = algoliasearch(ALGOLIA_APP_ID, searchKey);

    index.set(searchKey, client.initIndex("recipes"));
  }

  return index.get(searchKey) as SearchIndex;
};
