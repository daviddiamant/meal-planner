import {
  RECIPE_CLEAN,
  FETCH_RECIPE_DONE,
  SET_RECIPE_COLORS,
  RECIPE_CHANGE_PRIMARY_VIEW,
} from "../actions/actionTypes";

const initialState = {
  backButtonColor: "light",
  isIngredientsSelected: true,
  recipe: {},
};

const hsp = (r, g, b) =>
  Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

export function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case RECIPE_CLEAN:
      return initialState;

    case FETCH_RECIPE_DONE:
      return {
        ...state,
        recipe: action.recipe,
      };

    case SET_RECIPE_COLORS:
      const image = action.imgData.target;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const width = image.width;
      const height = image.height;
      const backButtonCheckEvery = 5;
      let [red, green, blue] = [0, 0, 0];

      canvas.width = width;
      canvas.height = height;

      context.drawImage(image, 0, 0, width, height);

      let areaToCheck = context.getImageData(25, 25, 50, 50).data;
      let numPixels = areaToCheck.length / 4 / backButtonCheckEvery;

      let i = 0;
      while (i + 3 < areaToCheck.length) {
        red += areaToCheck[i];
        green += areaToCheck[i + 1];
        blue += areaToCheck[i + 2];

        i += 4 * backButtonCheckEvery;
      }

      [red, green, blue] = [
        red / numPixels,
        green / numPixels,
        blue / numPixels,
      ];

      const backButtonBGInHsp = hsp(red, green, blue);
      const backButtonColor = backButtonBGInHsp > 127.5 ? "dark" : "light";

      return {
        ...state,
        backButtonColor,
      };

    case RECIPE_CHANGE_PRIMARY_VIEW:
      return {
        ...state,
        isIngredientsSelected:
          action.primaryView !== "ingredients" ? false : true,
      };

    default:
      return state;
  }
}
