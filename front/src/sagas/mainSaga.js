import { spawn } from "redux-saga/effects";

// Get the sagas
import { recipesSaga } from "./recipesSaga";
import { profileSaga } from "./profileSaga";
import { addSaga } from "./addSaga";
import { lazyLoadImagesSaga } from "./lazyLoadImagesSaga";
import { pingSaga } from "./pingSaga";

export function* mainSaga() {
  yield spawn(addSaga);
  yield spawn(recipesSaga);
  yield spawn(profileSaga);
  yield spawn(lazyLoadImagesSaga);
  yield spawn(pingSaga);
}
