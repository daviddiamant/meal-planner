import React, { useContext, useEffect, useRef } from "react";
import { useSpring } from "react-spring";
import { FelaComponent, ThemeContext } from "react-fela";

import { Input } from "./input";
import { AnimateWithScroll } from "./animateWithScroll";
import SearchFacets from "../reduxConnections/searchFacets";

const style = {
  constrainedContent: ({ theme }) => ({
    ...theme.constrained,
  }),
  searchWrapper: ({ theme, thin }) => ({
    position: "sticky",
    display: "flex",
    top: "0",
    paddingBottom: "15px",
    flexDirection: "column",
    flex: thin ? "none" : 1,
    background: theme.background,
    zIndex: 9999,
  }),
};

export const Search = ({
  query,
  sticky,
  onBlur,
  onFocus,
  onInput,
  completelySticky,
}) => {
  const theme = useContext(ThemeContext);

  const mounted = useRef(false);
  const onMount = () => {
    mounted.current = true;
  };
  useEffect(onMount, []);

  const animateSearchWrapper = useSpring({
    from: {
      paddingTop: sticky ? "0px" : "15px",
    },
    to: {
      paddingTop: sticky ? "15px" : "0px",
    },
    immediate: !mounted.current,
  });

  return (
    <FelaComponent style={style.searchWrapper} thin={completelySticky}>
      {({ className }) => (
        <AnimateWithScroll
          className={className}
          scrollRange={{
            at: 1,
          }}
          immediate={true}
          stopValues={1}
          initialValues={0}
          animateKeys={"borderBottom"}
          spring={animateSearchWrapper}
          valueFormats={(val) =>
            `${val}px solid ${theme.quaternaryColors.grey}`
          }
        >
          <FelaComponent style={style.constrainedContent}>
            <Input
              value={query}
              onBlur={onBlur}
              showClear={true}
              onFocus={onFocus}
              placeholder="Sökord.."
              onClear={() => onInput("")}
              onInput={(e) => onInput(e.target.value)}
            />
          </FelaComponent>
          <SearchFacets
            sticky={sticky}
            onInput={onInput}
            completelySticky={completelySticky}
          />
        </AnimateWithScroll>
      )}
    </FelaComponent>
  );
};
