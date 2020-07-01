import {
  booleanRes,
  singleValueBody,
  jwtHeader,
  recipesForLists,
} from "../mainSchema.js";

const oneRecipe = {
  body: singleValueBody,
  headers: jwtHeader,
  response: {
    200: booleanRes,
  },
};

export const addSchema = oneRecipe;

export const removeSchema = oneRecipe;

export const getAllSchema = {
  headers: jwtHeader,
  response: {
    200: recipesForLists,
  },
};
