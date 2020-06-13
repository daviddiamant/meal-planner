import { connect } from "react-redux";

import { Homepage as view } from "../components/homepage";

const mapStateToProps = (state) => {
  return {
    scrollPosition: state.browseRecipes.scrollPosition,
    title: state.appTitle,
    recipesLoaded: state.browseRecipes.isFetching,
    recipes: state.browseRecipes.recipes,
    buttonFinished: !state.navigationItems.runningAnimation,
    lazyLoadedImages: state.homepageLazyLoadedImages,
  };
};

const mapDispatchToProps = () => {
  return {};
};

const Homepage = connect(mapStateToProps, mapDispatchToProps)(view);

export default Homepage;
