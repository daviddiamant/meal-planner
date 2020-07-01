import { call, delay, select, take, takeEvery, put } from "redux-saga/effects";

// Local imports
import {
  GOT_JWT,
  ADD_GOT_RES,
  ADD_STATUS_GONE,
  START_FETCH_WEEK,
  DELETE_FROM_PROFILE,
  START_FETCH_FAVORITES,
  USER_STATE_CHANGED,
} from "../actions/actionTypes";

import {
  fetchWeekDone,
  startFetchWeek,
  fetchWeekFailed,
  fetchFavoritesDone,
  fetchFavoritesFailed,
  deleteFromProfileFailed,
  deleteFromProfileSuccess,
} from "../actions/actionCreators";

function* fetchRecipes(action, url, stateKey, successAction, failAction) {
  if (stateKey === "favorites") {
    // Not implemeted
    yield put(successAction([]));
    return;
  }

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
  if (recipes.length > 0 && !action.force) {
    // This is cached, no need to fetch
    yield put(successAction(recipes));
    return;
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

    if (Array.isArray(recipes)) {
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
  yield put(startFetchWeek(true));
}

function* deleteFromProfile(action, numTries = 0) {
  const gotAuth = yield select((state) => state.user.gotAuth);
  if (!gotAuth) {
    // Wait for firebase to give us the potential user
    yield take(USER_STATE_CHANGED);
  }

  const loggedIn = yield select((state) => state.user.loggedIn);
  if (!loggedIn) {
    yield put(deleteFromProfileFailed());
    return;
  }

  let JWT = yield select((state) => state.user.JWT);
  if (!JWT) {
    // Wait for the JWT to arrive
    JWT = yield take(GOT_JWT);
    JWT = JWT.JWT;
  }

  try {
    const location = window.location;
    let url;
    switch (action.sliderKey) {
      case "week":
        url = "plannedweek/remove";
        break;
      case "favorites":
        // change to favorites when the backend is in place
        url = "plannedweek/remove";
        break;
      default:
        throw new Error("Unknown sliderkey");
    }

    let res = yield call(
      fetch,
      `${location.protocol}//${location.hostname}/api/${url}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: action.slug }),
      }
    );
    res = yield res.json();

    if (res.result === true) {
      yield put(deleteFromProfileSuccess());
    } else {
      throw new Error("Could not add");
    }
  } catch (err) {
    if (numTries < 3) {
      yield delay(500 * (numTries + 1));
      yield deleteFromProfile(action, ++numTries);
      return;
    }

    yield put(deleteFromProfileFailed(err));
  }
}

export function* profileSaga() {
  yield takeEvery(START_FETCH_WEEK, (action) =>
    fetchRecipes(
      action,
      "/api/plannedweek",
      "week",
      fetchWeekDone,
      fetchWeekFailed
    )
  );

  // Change url to favorites when the backend is implemented
  yield takeEvery(START_FETCH_FAVORITES, (action) =>
    fetchRecipes(
      action,
      "/api/plannedweek",
      "favorites",
      fetchFavoritesDone,
      fetchFavoritesFailed
    )
  );

  yield takeEvery(ADD_GOT_RES, maybeUpdateProfile);

  yield takeEvery(DELETE_FROM_PROFILE, deleteFromProfile);
}
