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

const mapStateToProps = (state, props) => {
  // Get info about this specific image
  const imgState = state[props.stateKey][props.src];

  return {
    startedLazyLoading: imgState ? true : false,
    smallURL: imgState && imgState.smallLoaded ? imgState.smallLocalURL : "",
    loadImage: imgState && imgState.shouldBeLoaded,
    imageLoaded: imgState && imgState.loaded,
    imageDisplayed: imgState && imgState.displayed,
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    initLoad: (src, smallSrc, stateKey) =>
      dispatch(lazyLoadImage(src, smallSrc, stateKey)),
    loadLarge: (src, stateKey) =>
      dispatch(clearForLazyLargeImage(src, stateKey)),
    whenImageLoaded: (event) => {
      if (props.onLoad) {
        props.onLoad(event);
      }
      dispatch(gotLargeLazyLoaded(props.src, props.stateKey));
    },
    whenImageDisplayed: () => dispatch(lazyLoadDone(props.src, props.stateKey)),
    processSmallQueue: () => dispatch(processLazyLoadSmallQueue()),
    processLargeQueue: () => dispatch(processLazyLoadLargeQueue()),
    clearQueue: (stateKey) => dispatch(cleanUpLazyLoading([], stateKey)),
  };
};

const LazyLoadedImage = connect(mapStateToProps, mapDispatchToProps)(view);

export default LazyLoadedImage;
