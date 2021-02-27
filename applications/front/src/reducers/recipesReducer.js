import {
  BROWSE_RECIPES_SCROLL_POSITION,
  START_FETCH_RECIPES,
  FETCH_RECIPES_DONE,
  FETCH_RECIPES_FAILED,
  FETCH_RECIPES_CLEAN,
} from "../actions/actionTypes";

const initialState = {
  isFetching: false,
  scrollPosition: 0,
  recipes: [],
};

export function recipesReducer(state = initialState, action) {
  switch (action.type) {
    case START_FETCH_RECIPES:
      /***
       * This action is fired when the startpage recipes should be fetched.
       * It will trigger a saga that fetches the recipes
       ***/
      return {
        ...state,
        isFetching: true,
      };

    case FETCH_RECIPES_DONE:
      return {
        ...state,
        isFetching: false,
        recipes: action.recipes,
      };

    case FETCH_RECIPES_FAILED:
      return {
        ...state,
        isFetching: false,
      };

    case FETCH_RECIPES_CLEAN:
      return { ...initialState, scrollPosition: state.scrollPosition };

    case BROWSE_RECIPES_SCROLL_POSITION:
      return { ...state, scrollPosition: action.scrollY };

    default:
      return state;
  }
}
