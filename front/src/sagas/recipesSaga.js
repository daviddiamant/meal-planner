import {
  call,
  delay,
  put,
  select,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";

// Local imports
import {
  START_ADD_RECIPE,
  ADD_RECIPE_DONE,
  START_FETCH_RECIPE,
  START_FETCH_RECIPES,
} from "../actions/actionTypes";

import {
  updateAddRecipe,
  addRecipeGotRes,
  addRecipeDone,
  fetchRecipesDone,
  fetchRecipesFailed,
  fetchRecipeDone,
  fetchRecipeFailed,
} from "../actions/actionCreators";

function* addRecipe() {
  try {
    const url = yield select((state) => state.addRecipe.url);

    if (!url) {
      throw new Error("No url to add");
    }

    const location = window.location;
    let res = yield call(
      fetch,
      `${location.protocol}//${location.hostname}/api/recipes/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      }
    );
    res = yield res.json();

    if (res.result === "true") {
      yield put(addRecipeGotRes(true));
    } else {
      throw new Error("Could not add");
    }
  } catch (err) {
    yield put(addRecipeGotRes(false));
  }
  // Wait a bit, then reset add recipe box
  yield delay(2500);
  yield put(addRecipeDone());
}

function* clearAddRecipeURL() {
  let currentURL = yield select((state) => state.addRecipe.url);

  while (currentURL !== "") {
    // Remove one letter at a time
    const newUrl = currentURL.slice(0, -1);

    yield put(updateAddRecipe(newUrl));

    currentURL = newUrl;

    yield delay(35);
  }
}

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

function* fetchRecipes() {
  const recipes = yield select((state) => state.browseRecipes.recipes);

  if (recipes.length > 0) {
    // This is cached, no need to fetch
    yield put(fetchRecipesDone(recipes));
    return;
  }

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
  yield takeEvery(START_ADD_RECIPE, addRecipe);
  yield takeEvery(ADD_RECIPE_DONE, clearAddRecipeURL);
  yield takeEvery(START_FETCH_RECIPE, fetchRecipe);
  yield takeLatest(START_FETCH_RECIPES, fetchRecipes);
}
