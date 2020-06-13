import React, { Fragment } from "react";
import { Switch, Route } from "react-router-dom";

// Local imports
import Homepage from "../reduxConnections/homepage";
import { BottomMenu } from "../components/bottomMenu";
import { Navigation } from "../components/navigation";

const NavigationController = () => (
  <Fragment>
    <Switch>
      <Route path="/profile">
        <div>Profile</div>
      </Route>
      <Route path="/search">
        <div>Search</div>
      </Route>
      <Route path="/">
        <Homepage />
      </Route>
    </Switch>
    <BottomMenu>
      <Navigation />
    </BottomMenu>
  </Fragment>
);

export default NavigationController;
