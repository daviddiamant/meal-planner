import {
  applyMiddleware,
  createStore as reduxCreateStore,
  compose,
} from "redux";
import * as Sentry from "@sentry/react";
import createSagaMiddleware from "redux-saga";

import { default as initialState } from "./minimalState.json";
import { mainReducer } from "../reducers/mainReducer";
import { mainSaga } from "../sagas/mainSaga";

export function createStore() {
  const sagaMiddleware = createSagaMiddleware();
  const sentryReduxEnhancer = Sentry.createReduxEnhancer();

  const store = reduxCreateStore(
    mainReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? compose(
          applyMiddleware(sagaMiddleware),
          sentryReduxEnhancer,
          window.__REDUX_DEVTOOLS_EXTENSION__()
        )
      : applyMiddleware(sagaMiddleware)
  );

  sagaMiddleware.run(mainSaga);

  return store;
}
