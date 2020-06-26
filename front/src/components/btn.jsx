import React from "react";
import { FelaComponent } from "react-fela";
import { animated } from "react-spring";

const style = {
  button: ({ theme, background }) => ({
    ...theme.helpers.flexCenterBoth,
    width: "fit-content",
    minHeight: "50px",
    padding: "0 35px 0 35px",
    textAlign: "center",
    whiteSpace: "nowrap",
    fontFamily: '"Poppins", sans-serif',
    fontSize: "20px",
    fontWeight: "400",
    background: background || "none",
    color: background ? theme.backButtonColors.light : "none",
    borderRadius: `${theme.primary.borderRadius}px`,
  }),
};

export const Btn = ({
  children,
  style: externalStyle,
  background,
  animationStyle,
  ...props
}) => (
  <FelaComponent style={[style.button, externalStyle]} background={background}>
    {({ className }) => (
      <animated.div className={className} style={animationStyle} {...props}>
        {children}
      </animated.div>
    )}
  </FelaComponent>
);
