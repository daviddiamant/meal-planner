import { delay, put, takeEvery } from "redux-saga/effects";

// Local imports
import { NAVIGATION_CLICKED_DONE } from "../actions/actionTypes";
import { handleNavigationAnimation } from "../actions/actionCreators";

function* navigationItemDone() {
  yield delay(600); // Wait for the out transition to end
  // Fire the action
  yield put(handleNavigationAnimation());
}

export function* navigationItemsSaga() {
  yield takeEvery(NAVIGATION_CLICKED_DONE, navigationItemDone);
}
