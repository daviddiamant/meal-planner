import {
  OPEN_DROPDOWN,
  DROPDOWN_OPENED,
  DROPDOWN_SHOULD_CLOSE,
  CLOSE_DROPDOWN,
} from "../actions/actionTypes";

const initialState = {
  open: false,
  shouldOpen: false,
  shouldClose: false,
};

export function dropdownReducer(stateKey, state = initialState, action) {
  if (stateKey !== action.stateKey) {
    // This reducer is unaffected
    return state;
  }

  switch (action.type) {
    case OPEN_DROPDOWN:
      return {
        ...state,
        shouldOpen: true,
      };

    case DROPDOWN_OPENED:
      return {
        ...state,
        shouldOpen: false,
        open: true,
      };

    case DROPDOWN_SHOULD_CLOSE:
      return {
        ...state,
        shouldClose: true,
      };

    case CLOSE_DROPDOWN:
      return initialState;

    default:
      if (state === {}) {
        return initialState;
      }
      return state;
  }
}
