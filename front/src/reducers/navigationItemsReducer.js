import {
  ADD_NAVIGATION_CLICKED,
  NAVIGATION_CLICKED_DONE,
  HANDLE_NAVIGATION_ANIMATION,
} from "../actions/actionTypes";

const initialState = {
  runningAnimation: false,
  clicked: [],
  mutationLocks: [],
};

let clickOK = true;

export function navigationItemsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_NAVIGATION_CLICKED:
      /***
       * Add this path as clicked, and also add a mutation lock. The lock will have to be
       * removed before the path can be "unclicked"
       ***/
      if (state.clicked.some((x) => x === action.path) || !clickOK) {
        // This button is already clicked
        return state;
      }

      // Only respond to clicks every 500ms
      clickOK = false;
      setTimeout(() => (clickOK = true), 500);

      return {
        runningAnimation: true,
        clicked: [action.path, ...state.clicked],
        mutationLocks: [action.path, ...state.mutationLocks],
      };

    case NAVIGATION_CLICKED_DONE:
      /***
       * Check if the path is locked, if so - remove the lock. Otherwise "unclick" the item
       ***/
      const locked = state.mutationLocks.some((x) => x === action.path);
      const clicked = locked
        ? state.clicked
        : state.clicked.filter((x) => x !== action.path);
      const mutationLocks = locked
        ? state.mutationLocks.filter((x) => x !== action.path)
        : state.mutationLocks;

      return {
        runningAnimation: state.runningAnimation,
        clicked,
        mutationLocks,
      };

    case HANDLE_NAVIGATION_ANIMATION:
      return {
        ...state,
        runningAnimation: state.clicked.length ? true : false,
      };

    default:
      return state;
  }
}
