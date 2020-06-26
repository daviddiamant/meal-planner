import { call, select, takeEvery, put } from "redux-saga/effects";

// Local imports
import {
  START_FETCH_WEEK,
  START_FETCH_FAVORITES,
} from "../actions/actionTypes";

import {
  fetchWeekDone,
  fetchWeekFailed,
  fetchFavoritesDone,
  fetchFavoritesFailed,
} from "../actions/actionCreators";

function* fetchRecipes(url, stateKey, successAction, failAction) {
  const recipes = yield select((state) => state.profile[stateKey]);

  if (recipes.length > 0) {
    // This is cached, no need to fetch
    yield put(successAction(recipes));
    return;
  }

  try {
    const location = window.location;

    let recipes = yield call(
      fetch,
      `${location.protocol}//${location.hostname}${url}`
    );
    recipes = yield recipes.json();

    // Remove slice when backend is in place
    yield put(successAction(recipes.slice(stateKey === "week" ? -5 : -3)));
  } catch (err) {
    yield put(failAction(err));
  }
}

export function* profileSaga() {
  // Change url to weeks when the backend is implemented
  yield takeEvery(START_FETCH_WEEK, () =>
    fetchRecipes("/api/recipes", "week", fetchWeekDone, fetchWeekFailed)
  );
  // Change url to favorites when the backend is implemented
  yield takeEvery(START_FETCH_FAVORITES, () =>
    fetchRecipes(
      "/api/recipes",
      "favorites",
      fetchFavoritesDone,
      fetchFavoritesFailed
    )
  );
}
