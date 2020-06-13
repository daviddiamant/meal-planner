import { call, put, takeEvery } from "redux-saga/effects";

// Local imports
import { START_FETCH_RECIPE } from "../actions/actionTypes";
import { fetchRecipeDone, fetchRecipeFailed } from "../actions/actionCreators";

function* fetchRecipe(action) {
  try {
    const location = window.location;
    let recipe = yield call(
      fetch,
      `${location.protocol}//${location.hostname}/api/recipes/${action.slug}`
    );
    recipe = yield recipe.json();

    yield put(fetchRecipeDone(recipe));
  } catch (err) {
    yield put(fetchRecipeFailed(err));
  }
}

export function* recipeSaga() {
  yield takeEvery(START_FETCH_RECIPE, fetchRecipe);
}
