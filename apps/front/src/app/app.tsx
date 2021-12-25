import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";

import { Heading } from "../components";
import { useUser } from "../hooks";
import { Home, Login, Recipe } from "../pages";
import { globalStyling } from "../stitches.config";
import { getJWTInterceptor } from "../utils";
import { getMetaValue } from "../utils/importMeta";

export const App = (): JSX.Element | null => {
  useRegisterSW({});

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
    <Routes>
      <Route element={<Login />} path="/login" />
      <Route element={<Recipe />} path="/recipe/:slug" />
      <Route
        element={
          <>
            <Routes>
              <Route element={<Heading>search</Heading>} path="search" />
              <Route
                element={
                  <div role="banner">
                    <Heading>profile</Heading>
                  </div>
                }
                path="profile"
              />
              <Route element={<Home />} path="/" />
            </Routes>
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/profile">Profile</Link>
            {!user && <Navigate to="/login" />}
          </>
        }
        path="*"
      />
    </Routes>
  );
};
