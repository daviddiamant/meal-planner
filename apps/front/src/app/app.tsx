import axios from "axios";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";

import { Heading } from "../components";
import { useUser } from "../hooks";
import { globalStyling } from "../stitches.config";
import { getJWTInterceptor } from "../utils";

const Home = lazy(() => import("../pages/home"));
const Login = lazy(() => import("../pages/login"));
const Recipe = lazy(() => import("../pages/recipe"));

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
      <Route
        element={
          <Suspense fallback={null}>
            <Login />
          </Suspense>
        }
        path="/login"
      />
      <Route
        element={
          <Suspense fallback={null}>
            <Recipe />
          </Suspense>
        }
        path="/recipe/:slug"
      />
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
              <Route
                element={
                  <Suspense fallback={null}>
                    <Home />
                  </Suspense>
                }
                path="/"
              />
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
