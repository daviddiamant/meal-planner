import { START_LOG_IN, USER_STATE_CHANGED } from "../actions/actionTypes";

const initialState = { loggedIn: false, gotAuth: false };

export function userReducer(state = initialState, action) {
  switch (action.type) {
    case START_LOG_IN:
      return {
        ...state,
        gotAuth: false,
      };

    case USER_STATE_CHANGED:
      if (!action.user) {
        return {
          ...initialState,
          gotAuth: true,
        };
      }

      return {
        gotAuth: true,
        loggedIn: true,
        name: action.user.displayName || "Anonym användare",
        image:
          action.user.photoURL ||
          `${window.location.protocol}//${window.location.hostname}/recipe-images/undraw_profile_pic.png`,
      };

    default:
      return state;
  }
}
