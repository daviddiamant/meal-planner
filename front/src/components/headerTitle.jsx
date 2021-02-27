import React from "react";
import { animated } from "react-spring";
import { FelaComponent } from "react-fela";

const style = {
  constrainedContent: ({ theme }) => ({
    ...theme.constrained,
  }),
  top: () => ({
    display: "flex",
    flexDirection: "column",
  }),
  topHeading: ({ theme }) => ({
    ...theme.helpers.resetHeaders,
    fontSize: "6vw",
    ":first-letter": {
      marginLeft: "-0.27vw",
    },
  }),
  lowerHeading: ({ theme }) => ({
    ...theme.helpers.resetHeaders,
    fontSize: "9vw",
    marginTop: "5px",
    fontWeight: "200",
    color: theme.textColors.secondary,
    ":first-letter": {
      marginLeft: "-0.62vw",
    },
  }),
};

export const HeaderTitle = ({
  topTitle,
  bottomTitle,
  topAnimation = null,
  style: externalStyle,
  innerAnimation = null,
  bottomAnimation = null,
  ...props
}) => (
  <FelaComponent
    style={[style.constrainedContent, style.top, externalStyle]}
    {...props}
  >
    {({ className }) => (
      <animated.div className={className} style={innerAnimation}>
        <FelaComponent style={style.topHeading} as="h2">
          {({ className }) => (
            <animated.h2 className={className} style={topAnimation}>
              {topTitle}
            </animated.h2>
          )}
        </FelaComponent>
        <FelaComponent style={style.lowerHeading}>
          {({ className }) => (
            <animated.h3 className={className} style={bottomAnimation}>
              {bottomTitle}
            </animated.h3>
          )}
        </FelaComponent>
      </animated.div>
    )}
  </FelaComponent>
);
