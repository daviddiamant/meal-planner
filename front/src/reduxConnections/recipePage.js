import { connect } from "react-redux";

// Local imports
import { RecipePage as view } from "../components/recipePage";
import { changeRecipePrimaryView } from "../actions/actionCreators";

const mapStateToProps = (state, { slug }) => {
  // Ensure that only one of these can be true at once
  const isIngredientsSelected = state.recipePage.isIngredientsSelected;
  const isMethodSelected = !isIngredientsSelected;

  return {
    slug,
    fetched: state.recipePage.recipe.title ? true : false,
    hasRecipeData: state.recipePage.recipe?.ingredients ? true : false,
    recipe: state.recipePage.recipe,
    backButtonColor: state.recipePage.backButtonColor,
    isIngredientsSelected,
    isMethodSelected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeTab: (primaryView) => dispatch(changeRecipePrimaryView(primaryView)),
  };
};

const RecipePage = connect(mapStateToProps, mapDispatchToProps)(view);

export default RecipePage;
