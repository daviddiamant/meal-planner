import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Redirect, Route, Switch } from "react-router-dom";

import { Heading } from "../components";
import { useUser } from "../hooks";
import { Home, Login, Recipe } from "../pages";
import { globalStyling } from "../stitches.config";
import { getJWTInterceptor } from "../utils";

export const App = () => {
  // Check for service worker support
  if ("serviceWorker" in navigator) {
    // Register it
    if (process.env.NODE_ENV !== "development") {
      navigator.serviceWorker.register("/serviceworker.js");
    }
  }

  globalStyling();

  const { user } = useUser();
  const [setupDone, setSetupState] = useState(false);

  useEffect(() => {
    const jwtInterceptor = getJWTInterceptor(user);

    if (user !== undefined) {
      setSetupState(true);
    }

    return () => axios.interceptors.request.eject(jwtInterceptor);
  }, [user]);

  if (!setupDone) {
    return null;
  }

  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      {!user && <Redirect to="/login" />}
      <Route path="/recipe/:slug">
        <Recipe />
      </Route>
      <Route path="/">
        <Switch>
          <Route path="/search">
            <Heading>search</Heading>
          </Route>
          <Route path="/profile">
            <div role="banner">
              <Heading>profile</Heading>
            </div>
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <Link to="/">Home</Link>
        <Link to="/search">Search</Link>
        <Link to="/profile">Profile</Link>
      </Route>
    </Switch>
  );
};
