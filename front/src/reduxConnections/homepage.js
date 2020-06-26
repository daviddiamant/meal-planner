import { connect } from "react-redux";

// Local imports
import { Homepage as view } from "../components/homepage";
import {
  startFetchRecipes,
  cleanFetchRecipes,
  browseRecipesScrollPosition,
} from "../actions/actionCreators";

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

const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => dispatch(startFetchRecipes()),
    onUnmount: (scrollY) => {
      dispatch(cleanFetchRecipes());
      dispatch(browseRecipesScrollPosition(scrollY));
    },
  };
};

const Homepage = connect(mapStateToProps, mapDispatchToProps)(view);

export default Homepage;
