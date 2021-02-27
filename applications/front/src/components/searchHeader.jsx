import React, { useContext, useEffect, useRef } from "react";
import { animated, useSpring } from "react-spring";
import { ThemeContext } from "react-fela";

import { Header } from "./header";
import { HeaderTitle } from "./headerTitle";

const style = {
  header: () => ({
    minHeight: "auto",
  }),
};

export const SearchHeader = ({ visible }) => {
  const mounted = useRef(false);
  const theme = useContext(ThemeContext);

  const onMount = () => {
    mounted.current = true;
  };
  useEffect(onMount, []);

  const slideUpHeader = useSpring({
    from: {
      height: visible ? theme.headerHeight : "0px",
      minHeight: visible ? theme.headerHeight : "0px",
      opacity: visible ? 1 : 0,
    },
    to: {
      height: visible ? "0px" : theme.headerHeight,
      minHeight: visible ? "0px" : theme.headerHeight,
      opacity: visible ? 0 : 1,
      overflow: "hidden",
    },
    immediate: !mounted.current,
  });

  const slideUpInnerHeader = useSpring({
    from: {
      marginTop: visible ? "85px" : "0px",
    },
    to: {
      marginTop: visible ? "0px" : "85px",
    },
    immediate: !mounted.current,
  });

  const slideUpLowerTitle = useSpring({
    from: {
      fontSize: visible ? "9vw" : "0vw",
    },
    to: {
      fontSize: visible ? "0vw" : "9vw",
    },
    immediate: !mounted.current,
  });

  const slideUpTopTitle = useSpring({
    from: {
      fontSize: visible ? "6vw" : "0vw",
    },
    to: {
      fontSize: visible ? "0vw" : "6vw",
    },
    immediate: !mounted.current,
  });

  return (
    <animated.div style={slideUpHeader}>
      <Header style={style.header}>
        <HeaderTitle
          topTitle="Sök"
          bottomTitle="Recept"
          topAnimation={slideUpTopTitle}
          bottomAnimation={slideUpLowerTitle}
          innerAnimation={slideUpInnerHeader}
        />
      </Header>
    </animated.div>
  );
};
