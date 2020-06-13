import { connect } from "react-redux";

import { LazyLoadedImage as view } from "../components/lazyLoadedImage";
import { gotLargeLazyLoaded, lazyLoadDone } from "../actions/actionCreators";

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
    whenImageLoaded: (event) => {
      if (props.onLoad) {
        props.onLoad(event);
      }
      dispatch(gotLargeLazyLoaded(props.src, props.stateKey));
    },
    whenImageDisplayed: () => {
      dispatch(lazyLoadDone(props.src, props.stateKey));
    },
  };
};

const LazyLoadedImage = connect(mapStateToProps, mapDispatchToProps)(view);

export default LazyLoadedImage;
