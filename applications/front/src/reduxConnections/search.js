import { connect } from "react-redux";

// Local imports
import { Search as view } from "../components/search";
import { setSearchFocus, searchRecipes } from "../actions/actionCreators";

const mapStateToProps = ({ search: { query } }) => ({
  query,
});

const mapDispatchToProps = (dispatch) => ({
  onBlur: () => {
    dispatch(setSearchFocus(false));
  },
  onFocus: () => dispatch(setSearchFocus(true)),
  onInput: (value) => dispatch(searchRecipes(value)),
});

const Search = connect(mapStateToProps, mapDispatchToProps)(view);

export default Search;
