import React from "react";
import { FelaComponent } from "react-fela";
import { animated, useSpring } from "react-spring";

const style = {
  sliderMessage: ({ theme }) => ({
    ...theme.helpers.flexCenterBoth,
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    fontSize: "4vw",
  }),
};

export const SliderMessage = ({ children }) => {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
  });

  return (
    <FelaComponent style={style.sliderMessage}>
      {({ className }) => (
        <animated.div className={className} style={fadeIn}>
          {children}
        </animated.div>
      )}
    </FelaComponent>
  );
};
