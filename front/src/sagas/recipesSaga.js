import {
  call,
  delay,
  put,
  select,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

// Local imports
import { API_URL } from "../appConfig";
import {
  GOT_JWT,
  ADD_DONE,
  START_FETCH_RECIPE,
  START_FETCH_RECIPES,
  ADD_GOT_RES,
  USER_STATE_CHANGED,
} from "../actions/actionTypes";

import {
  updateAddRecipe,
  fetchRecipesDone,
  fetchRecipesFailed,
  fetchRecipeDone,
  fetchRecipeFailed,
} from "../actions/actionCreators";

function* getJWT() {
  const gotAuth = yield select((state) => state.user.gotAuth);
  if (!gotAuth) {
    // Wait for firebase to give us the potential user
    yield take(USER_STATE_CHANGED);
  }

  let JWT = yield select((state) => state.user.JWT);
  if (!JWT) {
    // Wait for the JWT to arrive
    JWT = yield take(GOT_JWT);
    JWT = JWT.JWT;
  }

  return JWT;
}

function* maybeUpdateRecipes(action) {
  if (action.stateKey !== "addRecipeBtn" || !action.res) {
    return;
  }

  // Update it after animations are done
  yield take(ADD_DONE);

  // A recipe has been added! Update recipes
  yield fetchRecipes(true);
}

function* clearAddRecipeInput(action) {
  if (action.stateKey !== "addRecipeBtn") {
    return;
  }

  // Remove url from input
  let currentURL = yield select((state) => state.addRecipeInput.url);

  while (currentURL !== "") {
    // Remove one letter at a time
    const newUrl = currentURL.slice(0, -1);

    yield put(updateAddRecipe(newUrl));

    currentURL = newUrl;

    yield delay(35);
  }
}

function* fetchRecipe(action) {
  const JWT = yield getJWT();

  try {
    let recipe = yield call(fetch, `${API_URL}/recipes/${action.slug}`, {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });
    recipe = yield recipe.json();

    yield put(fetchRecipeDone(recipe, action.isBackgroundFetch || false));
  } catch (err) {
    yield put(fetchRecipeFailed(err));
  }
}

function* fetchRecipes(forceUpdate = false) {
  const recipes = yield select((state) => state.browseRecipes.recipes);

  if (recipes.length > 0 && !forceUpdate) {
    // This is cached, no need to fetch
    yield put(fetchRecipesDone(recipes));
    return;
  }

  const JWT = yield getJWT();

  try {
    let recipes = yield call(fetch, `${API_URL}/recipes`, {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });
    recipes = yield recipes.json();
    yield put(fetchRecipesDone(recipes));
  } catch (err) {
    yield put(fetchRecipesFailed(err));
  }
}

export function* recipesSaga() {
  yield takeEvery(ADD_GOT_RES, maybeUpdateRecipes);
  yield takeEvery(ADD_DONE, clearAddRecipeInput);
  yield takeEvery(START_FETCH_RECIPE, fetchRecipe);
  yield takeLatest(START_FETCH_RECIPES, fetchRecipes);
}
