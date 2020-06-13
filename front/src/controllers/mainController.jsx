import React, { Fragment } from "react";
import { Provider } from "react-redux";
import { RendererProvider, ThemeProvider } from "react-fela";
import { createRenderer } from "fela";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Local imports
import { createStore } from "../stores/mainStore";
import baseTheme from "../themes/baseTheme";
import lightTheme from "../themes/lightTheme";
import BaseStyle from "../themes/baseStyle";
import NavigationController from "./navigationController";
import RecipePage from "../reduxConnections/recipePage";

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

const MainController = () => {
  const renderer = createRenderer();

  return (
    <Provider store={createStore()}>
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
    </Provider>
  );
};

export default MainController;
