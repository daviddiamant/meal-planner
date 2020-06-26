import React, { useContext } from "react";
import { FelaComponent, RendererContext } from "react-fela";
import { animated } from "react-spring";

const style = {
  wave: () => ({
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
  }),
  dot: ({ theme, waveKeyframe }) => ({
    display: "inline-block",
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    marginRight: "3px",
    background: theme.buttonColors.light,
    animation: `${waveKeyframe} 1.3s linear infinite`,
    ":nth-child(2)": {
      animationDelay: "-1.1s",
    },
    ":nth-child(3)": {
      animationDelay: "-0.9s",
    },
    ":last-child": {
      marginRight: 0,
    },
  }),
};

const keyframes = {
  wave: () => ({
    "0%": {
      transform: "initial",
    },
    "30%": {
      transform: "translateY(-5px)",
    },
    "60%": {
      transform: "initial",
    },
    "100%": {
      transform: "initial",
    },
  }),
};

export const LoadingDots = (props) => {
  const renderer = useContext(RendererContext);

  const waveKeyframe = renderer.renderKeyframe(keyframes.wave);

  return (
    <FelaComponent style={style.wave}>
      {({ className }) => (
        <animated.div className={className} {...props}>
          <FelaComponent style={style.dot} waveKeyframe={waveKeyframe} />
          <FelaComponent style={style.dot} waveKeyframe={waveKeyframe} />
          <FelaComponent style={style.dot} waveKeyframe={waveKeyframe} />
        </animated.div>
      )}
    </FelaComponent>
  );
};
