import React, { useEffect, useRef } from "react";
import { FelaComponent } from "react-fela";
import { useDispatch } from "react-redux";
import useScrollPosition from "@react-hook/window-scroll";
import { useWindowSize } from "@react-hook/window-size";

// Local imports
import { HomepageMasonry } from "../components/homepageMasonry";
import {
  startFetchRecipes,
  cleanFetchRecipes,
  browseRecipesScrollPosition,
} from "../actions/actionCreators";

const style = {
  titleWrapper: {
    margin: "75px 0 50px 0",
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
    padding: `0 15px 0 ${15 - theme.homepageCardMargin}px`,
    marginBottom: `${theme.navigationHeight + theme.navigationPaddingBottom}px`,
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
  buttonFinished,
  scrollPosition,
  lazyLoadedImages,
}) => {
  // Get the recipes on mount, and remove them on un-mount
  const dispatch = useDispatch();
  const windowHeight = useWindowSize()[1];
  const scrollY = useRef(0);
  scrollY.current = useScrollPosition(13 /*fps*/);

  const onMount = () => {
    // Make sure we can scroll, content will load eventually
    document.querySelector("body").style.minHeight = `${
      scrollPosition + windowHeight
    }px`;
    window.scrollTo(0, scrollPosition);

    dispatch(startFetchRecipes());
    return () => {
      document.querySelector("body").style.minHeight = "auto";
      dispatch(cleanFetchRecipes());
      dispatch(browseRecipesScrollPosition(scrollY.current));
    };
  };
  useEffect(onMount, []);

  return (
    <div>
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
      <FelaComponent style={style.masonryWrapper}>
        <FelaComponent style={style.masonry}>
          {({ className }) => (
            <HomepageMasonry
              stateKey="homepageMasonry"
              className={className}
              items={recipes}
              overscanBy={buttonFinished ? 7 : 3}
              overscanImagesBy={0.5}
              overscanSmallImagesBy={2}
              buttonFinished={buttonFinished}
              scrollPosition={scrollPosition}
              lazyLoadedImages={lazyLoadedImages}
            />
          )}
        </FelaComponent>
      </FelaComponent>
    </div>
  );
};