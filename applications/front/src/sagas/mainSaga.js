import { spawn } from "redux-saga/effects";

// Get the sagas
import { recipesSaga } from "./recipesSaga";
import { profileSaga } from "./profileSaga";
import { addSaga } from "./addSaga";
import { lazyLoadImagesSaga } from "./lazyLoadImagesSaga";
import { userSaga } from "./userSaga";
import { searchSaga } from "./searchSaga";

export function* mainSaga() {
  yield spawn(addSaga);
  yield spawn(userSaga);
  yield spawn(searchSaga);
  yield spawn(recipesSaga);
  yield spawn(profileSaga);
  yield spawn(lazyLoadImagesSaga);
}
