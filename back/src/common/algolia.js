import algoliasearch from "algoliasearch";

import { recipeForAlgoliaProjection } from "./projections";

let indexes = {};

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);

const allowedKeysForAlgolia = Object.keys(recipeForAlgoliaProjection).filter(
  (key) => recipeForAlgoliaProjection[key]
);

const connectIndex = (indexName) => {
  const index = client.initIndex(indexName);

  indexes[indexName] = index;

  return indexes[indexName];
};

export const getClient = () => client;

export const getIndex = (indexName) =>
  indexes[indexName] || connectIndex(indexName);

export const getFilteredRecipe = (recipe) =>
  Object.keys(recipe)
    .filter((key) => allowedKeysForAlgolia.includes(key))
    .reduce((filtered, key) => ({ ...filtered, [key]: recipe[key] }), {});
