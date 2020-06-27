import React, { useContext, useEffect, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import useScrollPosition from "@react-hook/window-scroll";

// Local imports
import { Header } from "./header";
import HomepageMasonry from "../reduxConnections/homepageMasonry";

const style = {
  titleWrapper: {
    margin: "70px 0 0 0",
    display: "flex",
    justifyContent: "center",
  },
  title: ({ theme }) => ({
    margin: 0,
    textAlign: "center",
    fontFamily: '"Pacifico", cursive',
    fontSize: "11vw",
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: "normal", // Font does not support it :(
    background: `linear-gradient(
			170deg,
			rgba(0,0,0,1) 0%,
			${theme.textColors.primary} 100%
		)`,
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  }),
  secondTitle: ({ theme }) => ({
    margin: 0,
    textAlign: "right",
    color: theme.textColors.secondary,
    fontSize: "7.6vw",
    fontWeight: 200,
    lineHeight: 1,
  }),
  masonryWrapper: ({ theme }) => ({
    width: "100%",
    marginTop: `-${theme.homepageCardMargin}px`,
    marginBottom: `${theme.navigationHeight + theme.navigationPaddingBottom}px`,
    padding: `0 15px 0 ${15 - theme.homepageCardMargin}px`,
    boxSizing: "border-box",
  }),
  masonry: {
    ":focus": {
      outline: "none",
    },
  },
};

export const Homepage = ({
  recipes,
  scrollPosition,
  onMount: externalOnMount,
  onUnmount,
}) => {
  const theme = useContext(ThemeContext);
  const scrollY = useRef(0);
  scrollY.current = useScrollPosition(13 /*fps*/);
  const headerRef = useRef();

  // Get the recipes on mount
  const onMount = () => {
    window.scrollTo(0, scrollPosition);

    externalOnMount();
    return () => {
      onUnmount(scrollY.current);
    };
  };
  useEffect(onMount, []);

  return (
    <div>
      <Header externalRef={headerRef}>
        <FelaComponent style={style.titleWrapper}>
          <div>
            <FelaComponent style={style.title} as="h1">
              David & Lovisas
            </FelaComponent>
            <FelaComponent style={style.secondTitle} as="h3">
              kokbok
            </FelaComponent>
          </div>
        </FelaComponent>
      </Header>
      <FelaComponent style={style.masonryWrapper}>
        <FelaComponent style={style.masonry}>
          {({ className }) => (
            <HomepageMasonry
              className={className}
              items={recipes}
              initialOffset={
                headerRef.current?.offsetHeight - theme.homepageCardMargin
              }
              overscanBy={7}
              overscanImagesBy={1}
              overscanSmallImagesBy={4}
              scrollPosition={scrollPosition}
            />
          )}
        </FelaComponent>
      </FelaComponent>
    </div>
  );
};
