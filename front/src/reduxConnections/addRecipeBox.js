import { connect } from "react-redux";

// Local imports
import { AddRecipeBox as view } from "../components/addRecipeBox";
import {
  addRecipe,
  updateAddRecipe,
  addRecipePlusGone,
  addRecipeDotsGone,
  addRecipeStatusGone,
} from "../actions/actionCreators";

const mapStateToProps = (state) => {
  const showPlus = !state.addRecipe.isAdding && state.addRecipe.status === null;
  const showDots = state.addRecipe.isAdding && state.addRecipe.status === null;
  const showCheck = state.addRecipe.status;
  const showCross = state.addRecipe.status === false;

  return {
    adding: state.addRecipe.isAdding,
    currentUrl: state.addRecipe.url,
    // Only one icon at a time
    showPlus:
      showPlus &&
      !(state.addRecipe.dotsShowing || state.addRecipe.statusShowing),
    showDots:
      showDots &&
      !(state.addRecipe.plusShowing || state.addRecipe.statusShowing),
    showCheck:
      showCheck &&
      !(state.addRecipe.plusShowing || state.addRecipe.dotsShowing),
    showCross:
      showCross &&
      !(state.addRecipe.plusShowing || state.addRecipe.dotsShowing),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInput: (url) => dispatch(updateAddRecipe(url)),
    onPlusOut: () => dispatch(addRecipePlusGone()),
    onAdd: (url) => dispatch(addRecipe(url)),
    onDotsOut: () => dispatch(addRecipeDotsGone()),
    onStatusOut: () => dispatch(addRecipeStatusGone()),
  };
};

const AddRecipeBox = connect(mapStateToProps, mapDispatchToProps)(view);

export default AddRecipeBox;
