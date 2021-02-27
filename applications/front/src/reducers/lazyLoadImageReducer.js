import {
  LAZY_LOAD_PROCESS_ONE,
  GOT_SMALL_LAZY_LOADED,
  LAZY_LOAD_PROCESS_ONE_LARGE,
  GOT_LARGE_LAZY_LOADED,
  LAZY_LOAD_DONE,
  LAZY_LOAD_CLEAN,
  FETCH_RECIPES_CLEAN,
} from "../actions/actionTypes";

const stateKeyDependantReturn = (stateKey, action, newState, oldState) => {
  return stateKey === action.stateKey ||
    (stateKey === "homepageLazyLoadedImages" && action.stateKey === null)
    ? newState
    : oldState;
};

export function lazyLoadImageReducer(stateKey, state = {}, action) {
  const imgState = state[action.url];
  const newState = {};

  switch (action.type) {
    case LAZY_LOAD_PROCESS_ONE:
      /***
       * This action is fired when an image should be lazy loaded.
       * It will trigger a saga that first lazy loads
       * a smaller version of the image
       ***/
      newState[action.url] = imgState || {
        smallUrl: action.smallUrl, // can be null if no small version exists
        smallLocalURL: "", // Will be filled when the image is loaded
        smallLoaded: false,
        shouldBeLoaded: false,
        loaded: false,
        displayed: false,
      };
      break;

    case GOT_SMALL_LAZY_LOADED:
      if (!imgState) {
        return state;
      }
      newState[action.url] = {
        ...imgState,
        smallLocalURL: action.localURL,
        smallLoaded: true,
      };
      break;

    case LAZY_LOAD_PROCESS_ONE_LARGE:
      if (!imgState || imgState.loaded) {
        return state;
      }
      newState[action.url] = {
        ...imgState,
        shouldBeLoaded: true,
      };
      break;

    case GOT_LARGE_LAZY_LOADED:
      if (!imgState) {
        return state;
      }
      newState[action.url] = {
        ...imgState,
        loaded: true,
      };
      break;

    case LAZY_LOAD_DONE:
      if (!imgState || !imgState.loaded) {
        // Could not find image or it has not been loaded and can therefore not be displayed
        return state;
      }
      newState[action.url] = {
        ...imgState,
        displayed: true,
      };
      break;

    case LAZY_LOAD_CLEAN:
      // only keep the ones we can see
      action.currentURLs.forEach((url) => {
        if (state[url]) {
          newState[url] = state[url];
        }
      });

      return stateKeyDependantReturn(stateKey, action, newState, state);

    case FETCH_RECIPES_CLEAN:
      if (stateKey !== "homepageLazyLoadedImages") {
        return state;
      }

      return {};

    default:
      return state;
  }

  return stateKeyDependantReturn(
    stateKey,
    action,
    { ...state, ...newState },
    state
  );
}
