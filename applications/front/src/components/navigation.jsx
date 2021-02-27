import React, { useEffect, useContext, useRef, Fragment } from "react";
import { useRouteMatch, useLocation } from "react-router-dom";
import { FelaComponent, ThemeContext } from "react-fela";

// Local imports
import NavigationItem from "../reduxConnections/navigationItem";

const style = {
  wrapper: ({ theme }) => ({
    position: "relative",
    bottom: 0,
    width: "100%",
    height: `${theme.navigationHeight}px`,
    ...theme.helpers.flexCenterBoth,
  }),
};

export const Navigation = () => {
  const navRef = useRef(null);

  // Set up a listener to remove the context menu from the nav-items (long click on mobile)
  useEffect(() => {
    window.oncontextmenu = function (event) {
      // We only want to disable it for the navbar
      if (!navRef.current.contains(event.target)) {
        return true;
      }
      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    return () => {
      window.oncontextmenu = null;
    };
  }, []);

  // Get current theme from Fela
  const theme = useContext(ThemeContext);
  const navHeight = theme.navigationHeight;

  const currentPath = useLocation().pathname;
  let isHome = useRouteMatch({ path: "/" }) || { isExact: false };
  let isSearch = useRouteMatch({ path: "/search" }) || { isExact: false };
  let isProfile = useRouteMatch({ path: "/profile" }) || { isExact: false };
  [isHome, isSearch, isProfile] = [
    isHome.isExact,
    isSearch.isExact,
    isProfile.isExact,
  ];

  return (
    <Fragment>
      <FelaComponent style={style.wrapper}>
        {({ className }) => (
          <div className={className} ref={navRef}>
            <NavigationItem
              navHeight={navHeight}
              linkFrom={currentPath}
              linkTo="/"
              selected={isHome}
              svgData="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
            <NavigationItem
              navHeight={navHeight}
              linkFrom={currentPath}
              linkTo="/search"
              selected={isSearch}
              svgData="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
            <NavigationItem
              navHeight={navHeight}
              linkFrom={currentPath}
              linkTo="/profile"
              selected={isProfile}
              svgData="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </div>
        )}
      </FelaComponent>
      <svg>
        <defs>
          {/*Create the gradient so each meny item can use it */}
          <linearGradient
            id="menyItemSelectedGradient"
            gradientTransform="rotate(90)"
          >
            <stop offset="0%" stopColor={theme.primaryColors.yellow} />
            <stop offset="100%" stopColor={theme.primaryColors.orange} />
          </linearGradient>
        </defs>
      </svg>
    </Fragment>
  );
};
