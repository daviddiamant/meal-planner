import { call, select, take, takeEvery, put } from "redux-saga/effects";

// Local imports
import {
  GOT_JWT,
  ADD_GOT_RES,
  ADD_STATUS_GONE,
  START_FETCH_WEEK,
  START_FETCH_FAVORITES,
  USER_STATE_CHANGED,
} from "../actions/actionTypes";

import {
  fetchWeekDone,
  fetchWeekFailed,
  fetchFavoritesDone,
  fetchFavoritesFailed,
} from "../actions/actionCreators";
import { isArray } from "lodash";

function* fetchRecipes(
  url,
  stateKey,
  successAction,
  failAction,
  forceFetch = false
) {
  const gotAuth = yield select((state) => state.user.gotAuth);
  if (!gotAuth) {
    // Wait for firebase to give us the potential user
    yield take(USER_STATE_CHANGED);
  }

  const loggedIn = yield select((state) => state.user.loggedIn);
  if (!loggedIn) {
    yield put(successAction([]));
    return;
  }

  const recipes = yield select((state) => state.profile[stateKey]);
  if (recipes.length > 0 && !forceFetch) {
    // This is cached, no need to fetch
    yield put(successAction(recipes));
    return;
  } else if (forceFetch) {
    // clear it while we are fetching
    yield put(successAction([]));
  }

  let JWT = yield select((state) => state.user.JWT);
  if (!JWT) {
    // Wait for the JWT to arrive
    JWT = yield take(GOT_JWT);
    JWT = JWT.JWT;
  }

  try {
    const location = window.location;

    let recipes = yield call(
      fetch,
      `${location.protocol}//${location.hostname}${url}`,
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
    recipes = yield recipes.json();

    if (isArray(recipes) && recipes.length) {
      yield put(successAction(recipes));
    } else {
      throw new Error("could not fetch");
    }
  } catch (err) {
    yield put(failAction(err));
  }
}

function* maybeUpdateProfile(action) {
  if (action.stateKey !== "planRecipeBtn" || !action.res) {
    return;
  }

  // Update it after animations are done
  yield take(ADD_STATUS_GONE);

  // A recipe has been planned! Update profile
  yield fetchRecipes(
    "/api/plannedweek",
    "week",
    fetchWeekDone,
    fetchWeekFailed,
    true
  );
}

export function* profileSaga() {
  yield takeEvery(START_FETCH_WEEK, () =>
    fetchRecipes("/api/plannedweek", "week", fetchWeekDone, fetchWeekFailed)
  );
  // Change url to favorites when the backend is implemented
  yield takeEvery(START_FETCH_FAVORITES, () =>
    fetchRecipes(
      "/api/plannedweek",
      "favorites",
      fetchFavoritesDone,
      fetchFavoritesFailed
    )
  );

  yield takeEvery(ADD_GOT_RES, maybeUpdateProfile);
}
