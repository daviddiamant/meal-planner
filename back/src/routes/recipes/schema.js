import { singleValueBody, booleanRes, recipesForLists } from "../mainSchema.js";

export const getOneSchema = {
  params: {
    slug: { type: "string" },
  },
  response: {
    200: {
      type: "object",
      properties: {
        screenshot: { type: "string" },
        smallImage: { type: "string" },
        smallImageWidth: { type: "number" },
        smallImageHeight: { type: "number" },
        image: { type: "string" },
        imageWidth: { type: "number" },
        imageHeight: { type: "number" },
        imagePalette: {
          type: "object",
          properties: {
            Vibrant: {
              type: "array",
              items: { type: "number" },
            },
            LightVibrant: {
              type: "array",
              items: { type: "number" },
            },
            DarkVibrant: {
              type: "array",
              items: { type: "number" },
            },
            Muted: {
              type: "array",
              items: { type: "number" },
            },
            LightMuted: {
              type: "array",
              items: { type: "number" },
            },
            DarkMuted: {
              type: "array",
              items: { type: "number" },
            },
          },
        },
        title: { type: "string" },
        description: { type: "string" },
        ingredients: {
          type: "array",
          items: {
            type: "object",
            properties: {
              unit: { type: "string" },
              ingredient: { type: "string" },
            },
          },
        },
        instructions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              instructions: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
        },
        url: { type: "string" },
      },
    },
  },
};

export const getAllSchema = {
  response: {
    200: recipesForLists,
  },
};

export const addSchema = {
  body: singleValueBody,
  response: {
    200: booleanRes,
  },
};
