import React, { Fragment, useEffect } from "react";
import { Provider } from "react-redux";
import { RendererProvider, ThemeProvider } from "react-fela";
import { createRenderer } from "fela";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as firebase from "firebase/app";
import "firebase/auth";

// Local imports
import { createStore } from "../stores/mainStore";
import {
  userStateChanged,
  regularMounted,
  gotJWT,
} from "../actions/actionCreators";
import baseTheme from "../themes/baseTheme";
import lightTheme from "../themes/lightTheme";
import BaseStyle from "../themes/baseStyle";
import NavigationController from "./navigationController";
import RecipePage from "../reduxConnections/recipePage";
import useFirebase from "../hooks/useFirebase";

const SubPage = ({ store, children }) => {
  const onMount = () => {
    store.dispatch(regularMounted());
  };
  useEffect(onMount, []);

  return children;
};

const Routes = ({ store }) => (
  <Switch>
    <Route path="/recipe/:slug" key="recipe">
      {({
        match: {
          params: { slug },
        },
      }) => (
        <SubPage store={store}>
          <RecipePage slug={slug} />
        </SubPage>
      )}
    </Route>
    <Route path="/">
      {/* The routes that have the bottom navbar (home, search, and profile)*/}
      <NavigationController store={store} />
    </Route>
  </Switch>
);

const InsideReduxStore = ({ store }) => {
  const firebaseApp = useFirebase();

  if (!firebaseApp) {
    // wait until we have the firebase app
    return null;
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      return;
    }

    store.dispatch(userStateChanged(user));
    user.getIdToken().then((JWT) => {
      store.dispatch(gotJWT(JWT));
    });
  });

  const renderer = createRenderer();

  return (
    <RendererProvider renderer={renderer}>
      <ThemeProvider theme={{ ...baseTheme, ...lightTheme }}>
        <Fragment>
          <BaseStyle />
          <Router>
            <Routes store={store} />
          </Router>
        </Fragment>
      </ThemeProvider>
    </RendererProvider>
  );
};

const MainController = () => {
  const store = createStore();
  return (
    <Provider store={store}>
      <InsideReduxStore store={store} />
    </Provider>
  );
};

export default MainController;
