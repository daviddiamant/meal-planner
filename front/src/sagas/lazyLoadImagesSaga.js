import {
  put,
  call,
  take,
  delay,
  select,
  debounce,
  takeEvery,
} from "redux-saga/effects";

// Local imports
import { IMAGE_URL } from "../appConfig";
import {
  LAZY_LOAD_PROCESS_SMALL_QUEUE,
  LAZY_LOAD_PROCESS_LARGE_QUEUE,
  LAZY_LOAD_PROCESS_ONE,
  LAZY_LOAD_PROCESS_ONE_LARGE,
  GOT_SMALL_LAZY_LOADED,
  GOT_LARGE_LAZY_LOADED,
  WEEK_WIDTH_CHANGED,
  FAVORITES_WIDTH_CHANGED,
  FETCH_FAVORITES_DONE,
  FETCH_WEEK_DONE,
} from "../actions/actionTypes";
import { getIndexKey } from "../reducers/lazyLoadQueueReducer";

import {
  lazyLoadImage as lazyLoadImageActionCreator,
  clearForLazyLargeImage,
  gotSmallLazyLoaded,
  processLazyLoadSmallQueue,
  processLazyLoadLargeQueue,
} from "../actions/actionCreators";

function* startSmallQueue() {
  const { queue } = yield select((state) => state.smallLazyLoadQueue);

  if (queue.length) {
    // Fire the action
    yield put({ ...queue[0], type: LAZY_LOAD_PROCESS_ONE });
  } else {
    yield processLargeQueue();
  }
}

function* startLargeQueue() {
  let { queue } = yield select((state) => state.largeLazyLoadQueue);
  const smallQueue = yield select((state) => state.smallLazyLoadQueue);

  if (!queue.length) {
    return false;
  }

  const indexKey = getIndexKey(queue[0]);
  if (!(indexKey in smallQueue.index)) {
    const currentState = yield select((state) => state[queue[0].stateKey]);
    const alreadyLoaded = currentState?.[queue[0].url]?.loaded;

    yield put({ ...queue[0], type: LAZY_LOAD_PROCESS_ONE_LARGE });

    if (alreadyLoaded) {
      yield processLargeQueue();
    }
  }
}

function* lazyLoadImage(action) {
  yield lazyLoadSmallImage(action);
}

function* lazyLoadSmallImage(action) {
  if (!action.smallUrl) {
    return false;
  }

  const currentState = yield select(
    (state) => state[action.stateKey || "homepageLazyLoadedImages"]
  );
  if (currentState[action.url].smallLoaded) {
    // This is already loaded
    // Fire the action
    yield put(
      gotSmallLazyLoaded(
        action.url,
        currentState[action.url].smallLocalURL,
        action.stateKey
      )
    );
    return;
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

function* initWeekOrFavoritesQueue(stateKey, fetchingKey, fetchDone) {
  const isFetching = yield select((state) => state.profile[fetchingKey]);
  if (isFetching) {
    yield take(fetchDone);
    // Make sure the recipes are in state
    yield delay(100);
  }

  let recipes = yield select((state) => state.profile[stateKey]);
  const numBeforeLazy = recipes.filter(
    (x) => x.smallImageWidth / x.smallImageHeight !== 1
  ).length;
  let numWidthUpdated = yield select(
    (state) => state.profile[`${stateKey}WidthAdjusted`]
  );

  if (
    typeof numBeforeLazy !== "undefined" &&
    numWidthUpdated >= numBeforeLazy
  ) {
    for (const recipe of recipes) {
      yield put(
        lazyLoadImageActionCreator(
          IMAGE_URL + recipe.mediumImage,
          IMAGE_URL + recipe.smallImage,
          `${stateKey}LazyLoadedImages`
        )
      );
      yield put(
        clearForLazyLargeImage(
          IMAGE_URL + recipe.mediumImage,
          `${stateKey}LazyLoadedImages`
        )
      );
    }

    // Start the queue
    yield put(processLazyLoadSmallQueue());
  }
}

export function* lazyLoadImagesSaga() {
  yield debounce(5, LAZY_LOAD_PROCESS_SMALL_QUEUE, startSmallQueue);
  yield takeEvery(LAZY_LOAD_PROCESS_LARGE_QUEUE, startLargeQueue);
  yield takeEvery(LAZY_LOAD_PROCESS_ONE, lazyLoadImage);
  yield takeEvery(GOT_SMALL_LAZY_LOADED, processSmallQueue);
  yield takeEvery(GOT_LARGE_LAZY_LOADED, processLargeQueue);
  yield takeEvery(WEEK_WIDTH_CHANGED, () =>
    initWeekOrFavoritesQueue("week", "isFetchingWeek", FETCH_WEEK_DONE)
  );
  yield takeEvery(FAVORITES_WIDTH_CHANGED, () =>
    initWeekOrFavoritesQueue(
      "favorites",
      "isFetchingFavorites",
      FETCH_FAVORITES_DONE
    )
  );
}
