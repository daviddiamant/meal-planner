import { connect } from "react-redux";

// Local imports
import { LazyLoadedImage as view } from "../components/lazyLoadedImage";
import {
  lazyLoadDone,
  lazyLoadImage,
  cleanUpLazyLoading,
  gotLargeLazyLoaded,
  clearForLazyLargeImage,
  processLazyLoadSmallQueue,
  processLazyLoadLargeQueue,
} from "../actions/actionCreators";

const mapStateToProps = (state, { stateKey, src }) => {
  // Get info about this specific image
  const imgState = state[stateKey][src];

  return {
    showImage:
      state[stateKey][src]?.smallLoaded && !state.navigationItems.changingView,
    startedLazyLoading: imgState ? true : false,
    smallURL:
      imgState && imgState.smallLoaded && !state.navigationItems.changingView
        ? imgState.smallLocalURL
        : "",
    loadImage:
      imgState &&
      imgState.shouldBeLoaded &&
      !state.navigationItems.changingView,
    imageLoaded:
      imgState && imgState.loaded && !state.navigationItems.changingView,
    imageDisplayed:
      imgState && imgState.displayed && !state.navigationItems.changingView,
  };
};

const mapDispatchToProps = (dispatch, { onLoad, stateKey, src }) => {
  return {
    initLoad: (src, smallSrc, stateKey) =>
      dispatch(lazyLoadImage(src, smallSrc, stateKey)),
    loadLarge: (src, stateKey) =>
      dispatch(clearForLazyLargeImage(src, stateKey)),
    whenImageLoaded: (event) => {
      if (onLoad) {
        onLoad(event);
      }
      dispatch(gotLargeLazyLoaded(src, stateKey));
    },
    whenImageDisplayed: () => dispatch(lazyLoadDone(src, stateKey)),
    processSmallQueue: () => dispatch(processLazyLoadSmallQueue()),
    processLargeQueue: () => dispatch(processLazyLoadLargeQueue()),
    clearQueue: (stateKey) => dispatch(cleanUpLazyLoading([], stateKey)),
  };
};

const LazyLoadedImage = connect(mapStateToProps, mapDispatchToProps)(view);

export default LazyLoadedImage;
