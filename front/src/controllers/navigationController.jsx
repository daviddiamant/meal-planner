import React, { Fragment, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

// Local imports
import ProtectedRoute from "./protectedRoute";
import Homepage from "../reduxConnections/homepage";
import ProfilePage from "../reduxConnections/profilePage";
import SearchPage from "../reduxConnections/searchPage";
import { BottomMenu } from "../components/bottomMenu";
import { Navigation } from "../components/navigation";
import { navigationUnmounted } from "../actions/actionCreators";

const SubPage = ({ store, children }) => {
  const onMount = () => {
    return () => store.dispatch(navigationUnmounted());
  };
  useEffect(onMount, []);

  return children;
};

const NavigationController = ({ store }) => {
  return (
    <Fragment>
      <Switch>
        <Route path="/profile">
          <SubPage store={store} key="profile">
            <ProfilePage />
          </SubPage>
        </Route>
        <ProtectedRoute path="/search">
          <SubPage store={store} key="search">
            <SearchPage />
          </SubPage>
        </ProtectedRoute>
        <ProtectedRoute path="/">
          <SubPage store={store} key="home">
            <Homepage />
          </SubPage>
        </ProtectedRoute>
      </Switch>
      <BottomMenu>
        <Navigation />
      </BottomMenu>
    </Fragment>
  );
};

export default NavigationController;
