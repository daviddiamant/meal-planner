import React, { useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import { FelaComponent } from "react-fela";

import { IMAGE_URL } from "../appConfig";
import { SearchFacetCircle } from "./searchFacetCircle";

const opacities = {
    darkOpacity: 0.45,
    lightOpacity: 0.2,
  },
  style = {
    facet: ({ thin, theme, colors: [r, g, b] }) => ({
      boxSizing: "border-box",
      position: "relative",
      height: thin ? "42px" : `calc(50% - ${theme.homepageCardMargin}px)`,
      width: thin
        ? "max-content"
        : `calc(50% - ${theme.homepageCardMargin / 2}px)`,
      display: "flex",
      alignItems: thin ? "center" : "flex-end",
      justifyContent: thin ? "center" : "flex-start",
      padding: thin ? "0 10px" : "20px",
      marginRight: thin ? "10px" : "auto",
      marginBottom: thin ? 0 : "10px",
      color: theme.textColors.primary,
      textTransform: "capitalize",
      backgroundColor: thin
        ? `rgba(${r}, ${g}, ${b}, ${opacities.darkOpacity})`
        : `#ffffff`,
      backgroundImage: thin
        ? "none"
        : `linear-gradient(135deg, rgba(${r}, ${g}, ${b}, ${opacities.lightOpacity}) 0%, rgba(${r}, ${g}, ${b}, ${opacities.lightOpacity}) 20%, rgba(${r}, ${g}, ${b}, ${opacities.darkOpacity}) 100%)`,
      borderRadius: `${theme.primary.borderRadius}px`,
      overflow: "hidden",
      ":nth-child(odd)": thin
        ? {}
        : {
            marginRight: `${theme.homepageCardMargin / 2}px`,
          },
      ":nth-child(even)": thin
        ? {}
        : {
            marginLeft: `${theme.homepageCardMargin / 2}px`,
          },
      ":nth-last-child(-n+2)": thin
        ? {}
        : {
            height: "50%",
            marginBottom: 0,
          },
    }),
    facetTitle: () => ({
      margin: 0,
    }),
  };

export const SearchFacet = ({
  facet,
  sticky,
  onClick,
  completelySticky,
  setAnimationPivot,
}) => {
  const mounted = useRef(false);
  const onMount = () => {
    mounted.current = true;
  };
  useEffect(onMount, []);

  const started = useRef(0);
  const haveChange =
    (!sticky && !completelySticky) || (sticky && completelySticky);
  // Fade in & out while the component transfers between thin and big
  const fadeFacet = useSpring({
    from: {
      opacity: haveChange ? "0" : "1",
    },
    to: {
      opacity: haveChange ? "1" : "0",
    },
    immediate: !mounted.current,
    onFrame: () => {
      started.current = started.current + 1;
    },
    onRest: () => {
      if (started.current > 10) {
        started.current = 0;
        setAnimationPivot(sticky ? true : false);
      }
    },
  });

  return (
    <FelaComponent
      colors={facet.colors}
      style={style.facet}
      thin={completelySticky}
    >
      {({ className }) => (
        <animated.div className={className} style={fadeFacet} onClick={onClick}>
          {completelySticky ? null : (
            <>
              <SearchFacetCircle
                colors={facet.colors}
                image={IMAGE_URL + facet.image}
                {...opacities}
              />
              <SearchFacetCircle
                top={true}
                colors={facet.colors}
                {...opacities}
              />
              <SearchFacetCircle
                bottom={true}
                colors={facet.colors}
                {...opacities}
              />
            </>
          )}
          <FelaComponent style={style.facetTitle} as="h4">
            {facet.title}
          </FelaComponent>
        </animated.div>
      )}
    </FelaComponent>
  );
};
