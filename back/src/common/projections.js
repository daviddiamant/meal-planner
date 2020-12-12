export const singleRecipeProjection = {
  _id: 0,
  screenshot: 1,
  smallImage: 1,
  smallImageWidth: 1,
  smallImageHeight: 1,
  image: 1,
  imageWidth: 1,
  imageHeight: 1,
  imagePalette: 1,
  title: 1,
  description: 1,
  ingredients: 1,
  instructions: 1,
  url: 1,
};

export const recipeForListsProjection = {
  _id: 0,
  title: 1,
  slug: 1,
  url: 1,
  smallImage: 1,
  smallImageWidth: 1,
  smallImageHeight: 1,
  mediumImage: 1,
  mediumImageWidth: 1,
  mediumImageHeight: 1,
};