import { call, delay, put, select, takeEvery } from "redux-saga/effects";
// Local imports
import { START_ADD } from "../actions/actionTypes";

import { addGotRes, addDone } from "../actions/actionCreators";

function* add(action) {
  try {
    if (!action.value) {
      throw new Error("Nothing to add");
    }

    const location = window.location;
    const JWT = yield select((state) => state.user.JWT);
    let res = yield call(
      fetch,
      `${location.protocol}//${location.hostname}${action.path}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: action.value }),
      }
    );
    res = yield res.json();

    if (res.result === true) {
      yield put(addGotRes(action.stateKey, true));
    } else {
      throw new Error("Could not add");
    }
  } catch (err) {
    yield put(addGotRes(action.stateKey, false));
  }
  // Wait a bit, then reset add button
  yield delay(2500);
  yield put(addDone(action.stateKey));
}

export function* addSaga() {
  yield takeEvery(START_ADD, add);
}
