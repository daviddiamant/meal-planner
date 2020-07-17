import React, { useContext, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useSpring, animated, config } from "react-spring";

const style = {
  tab: () => ({
    margin: 0,
    width: "50%",
    textAlign: "center",
  }),
  tabTitle: {
    display: "inline-block",
    marginTop: "0px",
    marginBottom: "10px",
    fontSize: "4.3vw",
  },
  tabBall: () => ({
    margin: "auto",
    borderRadius: "100%",
    overflow: "hidden",
  }),
  selectedTabBall: ({ background }) => ({
    background,
  }),
};

export const Tab = ({
  children,
  selected,
  changeTab,
  changeTo,
  vibrantColor,
}) => {
  const theme = useContext(ThemeContext);
  const numAnimations = useRef(0);

  const colorSpring = useSpring({
    to: {
      color: `${
        selected ? theme.textColors.primary : theme.textColors.secondary
      }`,
    },
    from: {
      color: `${
        selected ? theme.textColors.secondary : theme.textColors.primary
      }`,
    },
    immediate: numAnimations.current < 1, // Do not animate on mount
    config: config.fast,
  });

  const ballSize = 6;
  const ballSpringTo = {
    opacity: selected ? 1 : 0,
    background: selected ? vibrantColor : theme.background,
    width: `${selected ? ballSize : 0}px`,
    height: `${selected ? ballSize : 0}px`,
    marginTop: `${selected ? 0 : ballSize / 2}px`,
    marginBottom: `${selected ? 0 : ballSize / 2}px`,
  };
  const ballSpringFrom = {
    opacity: selected ? 0 : 1,
    background: selected ? theme.background : vibrantColor,
    width: `${selected ? 0 : ballSize}px`,
    height: `${selected ? 0 : ballSize}px`,
    marginTop: `${selected ? ballSize / 2 : 0}px`,
    marginBottom: `${selected ? ballSize / 2 : 0}px`,
  };
  /**
   * Uncomment to animate right to left
  if (changeTo === "ingredients") {
    ballSpringTo["left"] = `${selected ? 50 : 100}%`;
    ballSpringFrom["left"] = `${selected ? 100 : 50}%`;
    ballSpringTo["marginLeft"] = `${selected ? -ballSize / 2 : 0}px`;
    ballSpringFrom["marginLeft"] = `${selected ? 0 : -ballSize / 2}px`;
  } else {
    ballSpringTo["left"] = `${selected ? 50 : 0}%`;
    ballSpringFrom["left"] = `${selected ? 0 : 50}%`;
    ballSpringTo["marginLeft"] = `${selected ? -ballSize / 2 : 0}px`;
    ballSpringFrom["marginLeft"] = `${selected ? 0 : -ballSize / 2}px`;
  }*/
  const ballSpring = useSpring({
    to: ballSpringTo,
    from: ballSpringFrom,
    config: { duration: 300 },
    immediate: numAnimations.current < 1, // Do not animate on mount
    onRest: () => {
      numAnimations.current++;
    },
  });

  return (
    <FelaComponent style={style.tab}>
      {({ className }) => (
        <animated.div
          className={className}
          onClick={() => changeTab(changeTo)}
          style={colorSpring}
        >
          <FelaComponent style={style.tabTitle} as="h2">
            <FelaComponent style={style.tabBall}>
              {({ className }) => (
                <animated.div className={className} style={ballSpring} />
              )}
            </FelaComponent>
            {children}
          </FelaComponent>
        </animated.div>
      )}
    </FelaComponent>
  );
};
