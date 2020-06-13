import { call, put, takeLatest } from "redux-saga/effects";

// Local imports
import { START_FETCH_RECIPES } from "../actions/actionTypes";
import {
  fetchRecipesDone,
  fetchRecipesFailed,
} from "../actions/actionCreators";

function* fetchRecipes() {
  try {
    const location = window.location;
    let recipes = yield call(
      fetch,
      `${location.protocol}//${location.hostname}/api/recipes`
    );
    recipes = yield recipes.json();
    yield put(fetchRecipesDone(recipes));
  } catch (err) {
    yield put(fetchRecipesFailed(err));
  }
}

export function* recipesSaga() {
  yield takeLatest(START_FETCH_RECIPES, fetchRecipes);
}
