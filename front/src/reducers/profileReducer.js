import {
  START_FETCH_WEEK,
  FETCH_WEEK_DONE,
  FETCH_WEEK_FAILED,
  WEEK_WIDTH_CHANGED,
  START_FETCH_FAVORITES,
  FETCH_FAVORITES_DONE,
  FETCH_FAVORITES_FAILED,
  FAVORITES_WIDTH_CHANGED,
} from "../actions/actionTypes";

const initialState = {
  isFetchingWeek: false,
  week: [],
  weekWidthAdjusted: 0,
  isFetchingFavorites: false,
  favorites: [],
  favoritesWidthAdjusted: 0,
};

const isWeekType = (type) =>
  [
    START_FETCH_WEEK,
    FETCH_WEEK_DONE,
    FETCH_WEEK_FAILED,
    WEEK_WIDTH_CHANGED,
  ].some((x) => x === type);

const getIsFetchingKey = (type) =>
  isWeekType(type) ? "isFetchingWeek" : "isFetchingFavorites";

const getRecipesKey = (type) => (isWeekType(type) ? "week" : "favorites");

const getWidthAdjustedKey = (type) =>
  isWeekType(type) ? "weekWidthAdjusted" : "favoritesWidthAdjusted";

export function profileReducer(state = initialState, action) {
  let newState;
  switch (action.type) {
    case START_FETCH_FAVORITES:
    case START_FETCH_WEEK:
      newState = {
        ...state,
      };

      newState[getIsFetchingKey(action.type)] = true;

      return newState;

    case FETCH_FAVORITES_DONE:
    case FETCH_WEEK_DONE:
      newState = {
        ...state,
      };

      newState[getIsFetchingKey(action.type)] = false;
      newState[getRecipesKey(action.type)] = action[getRecipesKey(action.type)];

      return newState;

    case FETCH_FAVORITES_FAILED:
    case FETCH_WEEK_FAILED:
      newState = {
        ...state,
      };

      newState[getIsFetchingKey(action.type)] = false;

      return newState;

    case FAVORITES_WIDTH_CHANGED:
    case WEEK_WIDTH_CHANGED:
      if (state[getRecipesKey(action.type)].length) {
        newState = {
          ...state,
        };

        newState[getWidthAdjustedKey(action.type)] =
          state[getWidthAdjustedKey(action.type)] + 1;

        return newState;
      }
      return state;

    default:
      return state;
  }
}
