import { connect } from "react-redux";
import { createSelector } from "reselect";

// Local imports
import { Homepage as view } from "../components/homepage";
import {
  startFetchRecipes,
  browseRecipesScrollPosition,
} from "../actions/actionCreators";

const getRecipes = createSelector(
  (recipes) => recipes,
  (recipes) =>
    recipes.map((recipe) => ({
      ...recipe,
      stateKey: "homepageLazyLoadedImages",
    }))
);

const mapStateToProps = (state) => {
  return {
    scrollPosition: state.browseRecipes.scrollPosition,
    title: state.user.bookTitle,
    lowTitle: state.user.lowTitle,
    recipesLoaded: state.browseRecipes.isFetching,
    recipes: getRecipes(state.browseRecipes.recipes),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => dispatch(startFetchRecipes()),
    onUnmount: (scrollY) => {
      dispatch(browseRecipesScrollPosition(scrollY));
    },
  };
};

const Homepage = connect(mapStateToProps, mapDispatchToProps)(view);

export default Homepage;
