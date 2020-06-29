import { connect } from "react-redux";

// Local imports
import { AddRecipeBox as view } from "../components/addRecipeBox";
import { updateAddRecipe } from "../actions/actionCreators";

const mapStateToProps = (state) => {
  return {
    currentUrl: state.addRecipeInput.url,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInput: (url) => dispatch(updateAddRecipe(url)),
  };
};

const AddRecipeBox = connect(mapStateToProps, mapDispatchToProps)(view);

export default AddRecipeBox;
