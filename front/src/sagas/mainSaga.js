import { spawn } from "redux-saga/effects";

// Get the sagas
import { recipesSaga } from "./recipesSaga";
import { profileSaga } from "./profileSaga";
import { lazyLoadImagesSaga } from "./lazyLoadImagesSaga";

export function* mainSaga() {
  yield spawn(recipesSaga);
  yield spawn(profileSaga);
  yield spawn(lazyLoadImagesSaga);
}
