import {
  SEARCH_RECIPES,
  SET_SEARCH_FOCUS,
  SET_SEARCH_FACETS,
  SET_SEARCH_RESULT,
  SET_ANIMATION_PIVOT,
} from "../actions/actionTypes";

const initialState = {
  query: "",
  facets: [],
  recipes: [],
  focused: false,
  searching: false,
  animationPivot: false,
};

export function searchReducer(
  state = initialState,
  { query, focused, animationPivot, recipes, facets, ...action }
) {
  switch (action.type) {
    case SET_SEARCH_FOCUS:
      return {
        ...state,
        focused,
      };

    case SET_ANIMATION_PIVOT:
      return {
        ...state,
        animationPivot,
      };

    case SEARCH_RECIPES:
      return {
        ...state,
        searching: true,
        query,
      };

    case SET_SEARCH_RESULT:
      return {
        ...state,
        searching: false,
        recipes,
      };

    case SET_SEARCH_FACETS:
      return {
        ...state,
        facets,
      };

    default:
      return state;
  }
}
