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
  const imgState = state[stateKey]?.[src] ?? false;
  const changingView = state.navigationItems.changingViev;

  return {
    showImage: imgState?.smallLoaded && !changingView,
    startedLazyLoading: imgState ? true : false,
    smallURL:
      imgState?.smallLoaded && !changingView ? imgState.smallLocalURL : "",
    loadImage: imgState?.shouldBeLoaded && !changingView,
    imageLoaded: imgState?.loaded && !changingView,
    imageDisplayed: imgState?.displayed && !changingView,
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
