import React, { Fragment, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

// Local imports
import Homepage from "../reduxConnections/homepage";
import ProfilePage from "../reduxConnections/profilePage";
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
        <Route path="/search">
          <SubPage store={store} key="search">
            <div>Search</div>
          </SubPage>
        </Route>
        <Route path="/">
          <SubPage store={store} key="home">
            <Homepage />
          </SubPage>
        </Route>
      </Switch>
      <BottomMenu>
        <Navigation />
      </BottomMenu>
    </Fragment>
  );
};

export default NavigationController;
