export const booleanRes = {
  type: "object",
  properties: {
    result: { type: "boolean" },
  },
};

export const jwtHeader = {
  type: "object",
  required: ["Authorization"],
  properties: {
    Authorization: { type: "string" },
  },
};

export const singleValueBody = {
  type: "object",
  required: ["value"],
  properties: {
    value: { type: "string" },
  },
};

export const recipesForLists = {
  type: "array",
  items: {
    type: "object",
    properties: {
      title: { type: "string" },
      slug: { type: "string" },
      url: { type: "string" },
      smallImage: { type: "string" },
      smallImageWidth: { type: "number" },
      smallImageHeight: { type: "number" },
      mediumImage: { type: "string" },
      mediumImageWidth: { type: "number" },
      mediumImageHeight: { type: "number" },
    },
  },
};
