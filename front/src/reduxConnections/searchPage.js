import { connect } from "react-redux";

// Local imports
import { Searchpage as view } from "../components/searchPage";

const mapStateToProps = ({ search: { query, focused, animationPivot } }) => ({
  query,
  focused,
  animationPivot,
});

const SearchPage = connect(mapStateToProps)(view);

export default SearchPage;
