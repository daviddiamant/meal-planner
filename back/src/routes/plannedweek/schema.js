import {
  booleanRes,
  singleValueBody,
  jwtHeader,
  recipesForLists,
} from "../mainSchema.js";

export const addSchema = {
  body: singleValueBody,
  headers: jwtHeader,
  response: {
    200: booleanRes,
  },
};

export const getAllSchema = {
  headers: jwtHeader,
  response: {
    200: recipesForLists,
  },
};
