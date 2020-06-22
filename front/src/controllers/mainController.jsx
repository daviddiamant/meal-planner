import React, { Fragment } from "react";
import { Provider, useDispatch } from "react-redux";
import { RendererProvider, ThemeProvider } from "react-fela";
import { createRenderer } from "fela";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as firebase from "firebase/app";
import "firebase/auth";

// Local imports
import { createStore } from "../stores/mainStore";
import { userStateChanged } from "../actions/actionCreators";
import baseTheme from "../themes/baseTheme";
import lightTheme from "../themes/lightTheme";
import BaseStyle from "../themes/baseStyle";
import NavigationController from "./navigationController";
import RecipePage from "../reduxConnections/recipePage";
import useFirebase from "../hooks/useFirebase";

const Routes = () => (
  <Switch>
    <Route path="/recipe/:slug">
      {({
        match: {
          params: { slug },
        },
      }) => <RecipePage slug={slug} />}
    </Route>
    <Route path="/">
      {/* The routes that have the bottom navbar (home, search, and profile)*/}
      <NavigationController />
    </Route>
  </Switch>
);

const InsideReduxStore = () => {
  const firebaseApp = useFirebase();
  const dispatch = useDispatch();

  if (!firebaseApp) {
    // wait until we have the firebase app
    return null;
  }

  firebase.auth().onAuthStateChanged((user) => {
    dispatch(userStateChanged(user));
  });

  const renderer = createRenderer();

  return (
    <RendererProvider renderer={renderer}>
      <ThemeProvider theme={{ ...baseTheme, ...lightTheme }}>
        <Fragment>
          <BaseStyle />
          <Router>
            <Routes />
          </Router>
        </Fragment>
      </ThemeProvider>
    </RendererProvider>
  );
};

const MainController = () => (
  <Provider store={createStore()}>
    <InsideReduxStore />
  </Provider>
);

export default MainController;
