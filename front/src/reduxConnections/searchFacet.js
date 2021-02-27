import { connect } from "react-redux";

// Local imports
import { setAnimationPivot } from "../actions/actionCreators";
import { SearchFacet as view } from "../components/searchFacet";

const mapDispatchToProps = {
  setAnimationPivot,
};

const SearchFacet = connect(null, mapDispatchToProps)(view);

export default SearchFacet;
