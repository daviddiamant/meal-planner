import { connect } from "react-redux";

import { HomepageMasonry as view } from "../components/homepageMasonry";
import {
  lazyLoadImage,
  clearForLazyLargeImage,
  cleanUpLazyLoading,
  processLazyLoadSmallQueue,
  processLazyLoadLargeQueue,
} from "../actions/actionCreators";

const mapStateToProps = (state) => ({
  lazyLoadedImages: state.homepageLazyLoadedImages,
  buttonFinished:
    !state.navigationItems.changingView &&
    !state.navigationItems.runningAnimation,
});

const mapDispatchToProps = (dispatch) => {
  return {
    lazyLoadImage: (image, imageSmall) =>
      dispatch(lazyLoadImage(image, imageSmall, "homepageLazyLoadedImages")),
    processSmallQueue: () => dispatch(processLazyLoadSmallQueue()),
    loadLarge: (image) =>
      dispatch(clearForLazyLargeImage(image, "homepageLazyLoadedImages")),
    processLargeQueue: () => dispatch(processLazyLoadLargeQueue()),
    cleanUpLazyLoading: (current) => dispatch(cleanUpLazyLoading(current)),
  };
};

const HomepageMasonry = connect(mapStateToProps, mapDispatchToProps)(view);

export default HomepageMasonry;
