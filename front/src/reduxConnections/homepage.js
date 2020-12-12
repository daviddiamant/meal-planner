import { connect } from "react-redux";

// Local imports
import { Homepage as view } from "../components/homepage";
import {
  startFetchRecipes,
  browseRecipesScrollPosition,
} from "../actions/actionCreators";

const mapStateToProps = (state) => {
  return {
    scrollPosition: state.browseRecipes.scrollPosition,
    title: state.user.bookTitle,
    lowTitle: state.user.lowTitle,
    recipesLoaded: state.browseRecipes.isFetching,
    recipes: state.browseRecipes.recipes,
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
