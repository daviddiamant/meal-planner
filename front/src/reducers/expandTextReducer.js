import {
  CREATE_EXPAND_TEXT,
  REMOVE_EXPAND_TEXT,
  TOGGLE_EXPAND_TEXT,
  CHANGE_HEIGHT_EXPAND_TEXT,
} from "../actions/actionTypes";

const initialState = {
  numExpanders: 0,
  expanderState: {},
};

export function expandTextReducer(state = initialState, action) {
  let newExpanderState;

  switch (action.type) {
    case CREATE_EXPAND_TEXT:
      newExpanderState = { ...state.expanderState };
      newExpanderState[state.numExpanders] = {
        expanded: false,
        showExpandIcon: false,
      }; // Should not be expanded initially

      return {
        numExpanders: state.numExpanders + 1,
        expanderState: newExpanderState,
      };

    case REMOVE_EXPAND_TEXT:
      newExpanderState = { ...state.expanderState };
      delete newExpanderState[state.numExpanders];

      return {
        ...state,
        expanderState: newExpanderState,
      };

    case TOGGLE_EXPAND_TEXT:
      newExpanderState = { ...state.expanderState };
      newExpanderState[action.id].expanded = !newExpanderState[action.id]
        .expanded; // Flip it!

      return {
        ...state,
        expanderState: newExpanderState,
      };

    case CHANGE_HEIGHT_EXPAND_TEXT:
      newExpanderState = { ...state.expanderState };
      // Do not show the button if the content is smaller that the max height
      newExpanderState[action.id].showExpandIcon =
        action.innerHeight > action.outerHeight;

      return {
        ...state,
        expanderState: newExpanderState,
      };

    default:
      return state;
  }
}
