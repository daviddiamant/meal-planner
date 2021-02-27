import { connect } from "react-redux";
import { createSelector } from "reselect";

// Local imports
import { SearchResults as view } from "../components/searchResults";

const getRecipes = createSelector(
  (recipes) => recipes,
  (recipes) =>
    recipes.filter(
      (recipe) => recipe.mediumImageWidth && recipe.mediumImageHeight
    )
);

const mapStateToProps = ({ search: { query, searching, recipes } }) => ({
  query,
  searching,
  recipes: getRecipes(recipes),
});

const SearchResults = connect(mapStateToProps)(view);

export default SearchResults;
