import { call, select, put, takeEvery } from "redux-saga/effects";

// Local imports
import {
  LAZY_LOAD_PROCESS_SMALL_QUEUE,
  LAZY_LOAD_PROCESS_LARGE_QUEUE,
  LAZY_LOAD_PROCESS_ONE,
  LAZY_LOAD_PROCESS_ONE_LARGE,
  GOT_SMALL_LAZY_LOADED,
  GOT_LARGE_LAZY_LOADED,
} from "../actions/actionTypes";
import {
  gotSmallLazyLoaded,
  processLazyLoadSmallQueue,
  processLazyLoadLargeQueue,
} from "../actions/actionCreators";

function* startSmallQueue() {
  let queue = yield select((state) => state.smallLazyLoadQueue);

  if (queue.length) {
    // Fire the action
    yield put({ ...queue[0], type: LAZY_LOAD_PROCESS_ONE });
  } else {
    yield processLargeQueue();
  }
}

function* startLargeQueue() {
  let queue = yield select((state) => state.largeLazyLoadQueue);
  let smallQueue = yield select((state) => state.smallLazyLoadQueue);

  const raceWithSmall =
    queue[0]?.url &&
    smallQueue.length &&
    !smallQueue.some((x) => x.url === queue[0].url);
  if (queue.length && !raceWithSmall) {
    // We have a queue and there is no concurrency race with the small queue
    // (Small queue always needs to be processed first)
    yield put({ ...queue[0], type: LAZY_LOAD_PROCESS_ONE_LARGE });
  }
}

function* lazyLoadImage(action) {
  yield lazyLoadSmallImage(action);
}

function* lazyLoadSmallImage(action) {
  if (!action.smallUrl) {
    return false;
  }

  // We have a small image for this one - load it!
  let smallImage = yield call(fetch, action.smallUrl);
  smallImage = yield smallImage.blob();
  smallImage = yield URL.createObjectURL(smallImage);

  // Fire the action
  yield put(gotSmallLazyLoaded(action.url, smallImage, action.stateKey));
}

function* processSmallQueue() {
  // Notify the queue
  yield put(processLazyLoadSmallQueue());
}

function* processLargeQueue() {
  // Notify the queue
  yield put(processLazyLoadLargeQueue());
}

export function* lazyLoadImagesSaga() {
  yield takeEvery(LAZY_LOAD_PROCESS_SMALL_QUEUE, startSmallQueue);
  yield takeEvery(LAZY_LOAD_PROCESS_LARGE_QUEUE, startLargeQueue);
  yield takeEvery(LAZY_LOAD_PROCESS_ONE, lazyLoadImage);
  yield takeEvery(GOT_SMALL_LAZY_LOADED, processSmallQueue);
  yield takeEvery(GOT_LARGE_LAZY_LOADED, processLargeQueue);
}
