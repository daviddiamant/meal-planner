import { call, put, takeEvery } from "redux-saga/effects";

// Local imports
import { CHECK_PING } from "../actions/actionTypes";
import { pingDone } from "../actions/actionCreators";

function* pingServer() {
  try {
    const location = window.location;
    let ping = yield call(
      fetch,
      `${location.protocol}//${location.hostname}/api/ping`
    );
    ping = yield ping.status;

    if (ping !== 200) {
      throw new Error("Wrong response code");
    }

    yield put(pingDone(true));
  } catch (err) {
    yield put(pingDone(false));
  }
}

export function* pingSaga() {
  yield takeEvery(CHECK_PING, pingServer);
}
