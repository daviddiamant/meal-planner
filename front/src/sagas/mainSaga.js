import { spawn } from "redux-saga/effects";

// Get the sagas
import { recipeSaga } from "./recipeSaga";
import { recipesSaga } from "./recipesSaga";
import { lazyLoadImagesSaga } from "./lazyLoadImagesSaga";

export function* mainSaga() {
  yield spawn(recipeSaga);
  yield spawn(recipesSaga);
  yield spawn(lazyLoadImagesSaga);
}
