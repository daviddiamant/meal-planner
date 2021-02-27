import {
  ADD_ADD_GONE,
  START_ADD,
  ADD_GOT_RES,
  ADD_ADDING_GONE,
  ADD_DONE,
  ADD_STATUS_GONE,
} from "../actions/actionTypes";

const initialState = {
  isAdding: false,
  status: null,
  addShowing: true,
  addingShowing: false,
  statusShowing: false,
};

export function addReducer(stateKey, state = initialState, action) {
  if (stateKey !== action.stateKey) {
    // This reducer is unaffected
    return state;
  }

  switch (action.type) {
    case START_ADD:
      return {
        ...state,
        isAdding: true,
      };

    case ADD_ADD_GONE:
      if (state.status === null) {
        // We have not got any response yet - show adding
        return {
          ...state,
          addingShowing: true,
          addShowing: false,
        };
      }

      // We do have a response - skip dots
      return {
        ...state,
        statusShowing: true,
        addShowing: false,
      };

    case ADD_GOT_RES:
      return {
        ...state,
        statusShowing: true,
        status: action.res,
      };

    case ADD_ADDING_GONE:
      return {
        ...state,
        addingShowing: false,
      };

    case ADD_STATUS_GONE:
      return {
        ...state,
        statusShowing: false,
      };

    case ADD_DONE:
      return {
        ...initialState,
        statusShowing: state.statusShowing,
      };

    default:
      if (state === {}) {
        return initialState;
      }
      return state;
  }
}
