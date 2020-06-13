import {
  LAZY_LOAD_IMAGE,
  LAZY_LOAD_PROCESS_ONE,
  LAZY_LOAD_CLEAR_FOR_LARGE,
  LAZY_LOAD_PROCESS_ONE_LARGE,
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

      return [...state, action];

    case LAZY_LOAD_PROCESS_ONE:
      if (!isSmall || state.length === 0) {
        return state;
      }

      return rest;

    case LAZY_LOAD_CLEAR_FOR_LARGE:
      if (isSmall) {
        return state;
      }

      return [...state, action];

    case LAZY_LOAD_PROCESS_ONE_LARGE:
      if (isSmall || state.length === 0) {
        return state;
      }

      return rest;

    default:
      return state;
  }
}
