import {
  FETCH_WEEK_DONE,
  START_FETCH_WEEK,
  FETCH_WEEK_FAILED,
  WEEK_WIDTH_CHANGED,
  DELETE_FROM_PROFILE,
  FETCH_FAVORITES_DONE,
  START_FETCH_FAVORITES,
  FETCH_FAVORITES_FAILED,
  FAVORITES_WIDTH_CHANGED,
  DELETE_FROM_PROFILE_FADE_DONE,
  DELETE_FROM_PROFILE_ANIMATIONS_DONE,
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

      newState[getWidthAdjustedKey(action.type)] = 0;
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

    case DELETE_FROM_PROFILE_FADE_DONE:
    case DELETE_FROM_PROFILE:
      let keyToChange;
      switch (action.type) {
        default:
        case DELETE_FROM_PROFILE:
          keyToChange = "isDeleted";
          break;
        case DELETE_FROM_PROFILE_FADE_DONE:
          keyToChange = "isFaded";
          break;
      }

      newState = {
        ...state,
      };

      const i = newState[action.sliderKey].findIndex(
        (x) => x.slug === action.slug
      );
      let newImageState = {
        ...newState[action.sliderKey][i],
      };

      newImageState[keyToChange] = true;
      newState[action.sliderKey][i] = newImageState;

      return newState;

    case DELETE_FROM_PROFILE_ANIMATIONS_DONE:
      newState = { ...state };

      newState[action.sliderKey] = newState[action.sliderKey].filter(
        (x) => x.slug !== action.slug
      );

      return newState;

    default:
      return state;
  }
}
