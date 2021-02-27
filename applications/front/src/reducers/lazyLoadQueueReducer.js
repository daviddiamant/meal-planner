import {
  LAZY_LOAD_CLEAN,
  LAZY_LOAD_IMAGE,
  LAZY_LOAD_PROCESS_ONE,
  LAZY_LOAD_CLEAR_FOR_LARGE,
  LAZY_LOAD_PROCESS_ONE_LARGE,
} from "../actions/actionTypes";

const initialState = {
  index: {},
  queue: [],
};

const getRestState = (state, indexKey) => {
  const [, ...restQueue] = state.queue;
  const restIndex = { ...state.index };
  delete restIndex[indexKey];

  return {
    queue: restQueue,
    index: restIndex,
  };
};

export const getIndexKey = (action) => `${action?.stateKey}-${action?.url}`;

export function lazyLoadQueueReducer(stateKey, state = initialState, action) {
  if (!action.stateKey) {
    return state;
  }

  const isSmall = stateKey.includes("small");
  const indexKey = getIndexKey(action);

  switch (action.type) {
    case LAZY_LOAD_IMAGE:
      if (!isSmall) {
        return state;
      }

      // Ensure no duplicates
      if (indexKey in state.index) {
        return state;
      } else {
        return {
          queue: [...state.queue, action],
          index: { ...state.index, [indexKey]: true },
        };
      }

    case LAZY_LOAD_PROCESS_ONE:
      if (!isSmall || state.queue.length === 0) {
        return state;
      }

      return getRestState(state, indexKey);

    case LAZY_LOAD_CLEAR_FOR_LARGE:
      if (isSmall) {
        return state;
      }

      // Ensure no duplicates
      if (indexKey in state.index) {
        return state;
      } else {
        return {
          queue: [...state.queue, action],
          index: { ...state.index, [indexKey]: true },
        };
      }

    case LAZY_LOAD_PROCESS_ONE_LARGE:
      if (isSmall || state.queue.length === 0) {
        return state;
      }

      return getRestState(state, indexKey);

    case LAZY_LOAD_CLEAN:
      return initialState;

    default:
      return state;
  }
}
