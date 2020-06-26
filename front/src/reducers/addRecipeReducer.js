import {
  UPDATE_ADD_RECIPE,
  ADD_RECIPE_PLUS_GONE,
  START_ADD_RECIPE,
  ADD_RECIPE_GOT_RES,
  ADD_RECIPE_DOTS_GONE,
  ADD_RECIPE_DONE,
  ADD_RECIPE_STATUS_GONE,
} from "../actions/actionTypes";

const initialState = {
  isAdding: false,
  status: null,
  plusShowing: true,
  dotsShowing: false,
  statusShowing: false,
  url: "",
};

export function addRecipeReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ADD_RECIPE:
      return {
        ...state,
        url: action.url,
      };

    case START_ADD_RECIPE:
      return {
        ...state,
        isAdding: true,
      };

    case ADD_RECIPE_PLUS_GONE:
      if (state.status === null) {
        // We have not got any response yet - show dots
        return {
          ...state,
          dotsShowing: true,
          plusShowing: false,
        };
      }

      // We do have a response - skip dots
      return {
        ...state,
        statusShowing: true,
        plusShowing: false,
      };

    case ADD_RECIPE_GOT_RES:
      return {
        ...state,
        statusShowing: true,
        status: action.res,
      };

    case ADD_RECIPE_DOTS_GONE:
      return {
        ...state,
        dotsShowing: false,
      };

    case ADD_RECIPE_DONE:
      return {
        ...initialState,
        url: state.url, // This will be cleared by the saga
        statusShowing: state.statusShowing,
      };

    case ADD_RECIPE_STATUS_GONE:
      return {
        ...state,
        statusShowing: false,
      };

    default:
      return state;
  }
}
