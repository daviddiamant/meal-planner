import {
  LAZY_LOAD_IMAGE,
  LAZY_LOAD_PROCESS_ONE,
  LAZY_LOAD_CLEAR_FOR_LARGE,
  LAZY_LOAD_PROCESS_ONE_LARGE,
  LAZY_LOAD_REMOVE_FROM_QUEUE,
} from "../actions/actionTypes";

export function lazyLoadQueueReducer(stateKey, state = [], action) {
  let isSmall = stateKey.indexOf("small");
  isSmall = isSmall < 1 && isSmall !== -1;

  // eslint-disable-next-line
  const [_, ...rest] = state;

  switch (action.type) {
    case LAZY_LOAD_IMAGE:
      if (!isSmall) {
        return state;
      }

      // Ensure no duplicates
      if (state.some((x) => x.url === action.url)) {
        return state;
      } else {
        return [...state, action];
      }

    case LAZY_LOAD_PROCESS_ONE:
      if (!isSmall || state.length === 0) {
        return state;
      }

      return rest;

    case LAZY_LOAD_CLEAR_FOR_LARGE:
      if (isSmall) {
        return state;
      }

      // Ensure no duplicates
      if (state.some((x) => x.url === action.url)) {
        return state;
      } else {
        return [...state, action];
      }

    case LAZY_LOAD_PROCESS_ONE_LARGE:
      if (isSmall || state.length === 0) {
        return state;
      }

      return rest;

    case LAZY_LOAD_REMOVE_FROM_QUEUE:
      const newState = state.filter((x) => {
        return x.url !== action.url;
      });
      return newState;
    default:
      return state;
  }
}
