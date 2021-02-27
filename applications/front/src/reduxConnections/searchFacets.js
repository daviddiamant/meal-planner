import { connect } from "react-redux";

// Local imports
import { loadSearchFacets } from "../actions/actionCreators";
import { SearchFacets as view } from "../components/searchFacets";

const mapStateToProps = ({ search: { facets, query } }) => ({
  facets,
  searchQuery: query,
});

const mapDispatchToProps = {
  loadFacets: loadSearchFacets,
};

const SearchFacets = connect(mapStateToProps, mapDispatchToProps)(view);

export default SearchFacets;
