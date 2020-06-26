import {
  RECIPE_CLEAN,
  FETCH_RECIPE_DONE,
  RECIPE_CHANGE_PRIMARY_VIEW,
} from "../actions/actionTypes";

const initialState = {
  backButtonColor: "light",
  isIngredientsSelected: true,
  recipe: {},
};

export function recipeReducer(state = initialState, action) {
  switch (action.type) {
    case RECIPE_CLEAN:
      return initialState;

    case FETCH_RECIPE_DONE:
      return {
        ...state,
        recipe: action.recipe,
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
