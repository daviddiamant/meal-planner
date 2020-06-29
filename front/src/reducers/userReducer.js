import {
  START_LOG_IN,
  USER_STATE_CHANGED,
  GOT_JWT,
} from "../actions/actionTypes";

const initialState = {
  loggedIn: false,
  gotAuth: false,
  uID: null,
  JWT: null,
  name: null,
  image: null,
};

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
        ...state,
        gotAuth: true,
        loggedIn: true,
        uID: action.user.uid,
        name: action.user.displayName || "Anonym användare",
        image:
          action.user.photoURL ||
          `${window.location.protocol}//${window.location.hostname}/recipe-images/undraw_profile_pic.png`,
      };

    case GOT_JWT:
      return {
        ...state,
        JWT: action.JWT,
      };

    default:
      return state;
  }
}
