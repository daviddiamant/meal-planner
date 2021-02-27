import { UPDATE_ADD_RECIPE } from "../actions/actionTypes";

const initialState = {
  url: "",
};

export function addRecipeInputReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ADD_RECIPE:
      return {
        ...state,
        url: action.url,
      };

    default:
      return state;
  }
}
