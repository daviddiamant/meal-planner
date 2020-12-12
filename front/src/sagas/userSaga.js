import { call, put, select, takeEvery } from "redux-saga/effects";
// Local imports
import { API_URL } from "../appConfig";
import { START_FETCH_USER } from "../actions/actionTypes";
import { fetchUserDone } from "../actions/actionCreators";

function* add(action) {
  try {
    if (!action.uID) {
      throw new Error("Trying to fetch undefined user");
    }

    const JWT = yield select((state) => state.user.JWT);
    let res = yield call(fetch, `${API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${JWT}`,
      },
    });
    res = yield res.json();

    yield put(fetchUserDone(res));
  } catch (err) {
    throw new Error("Could not fetch user");
  }
}

export function* userSaga() {
  yield takeEvery(START_FETCH_USER, add);
}
