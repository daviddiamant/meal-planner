import React, { useContext, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useDrag } from "react-use-gesture";
import { animated, useSpring } from "react-spring";
import { useWindowSize } from "@react-hook/window-size";

const style = {
  slider: () => ({
    width: "100%",
    overflow: "hidden",
  }),
  inner: ({ theme }) => ({
    position: "relative",
    display: "flex",
    width: "max-content",
    marginLeft: `${theme.constrainedMargin}px`,
  }),
};

export const Slider = ({ children, style: externalStyle, ...props }) => {
  const theme = useContext(ThemeContext);
  const [windowWidth] = useWindowSize();
  const innerRef = useRef();
  const prevPos = useRef(0);

  const dragBinder = useDrag(({ down, movement, velocity }) => {
    let newLeft = prevPos.current + movement[0];

    if (!down) {
      // Give it a little extra "push". 0.4 friction constant
      newLeft +=
        (prevPos.current - newLeft < 0 ? 1 : -1) *
        ((velocity * 10) ** 2 / (2 * 0.4));

      // Check boundaries
      const minLeft =
        windowWidth -
        innerRef.current.offsetWidth -
        theme.constrainedMargin -
        theme.sliderCardMargin;

      if (newLeft > 0) {
        newLeft = 0;
      } else if (newLeft < minLeft) {
        newLeft = minLeft;
      }

      prevPos.current = newLeft;
    }

    // Now update the position
    setPos({ left: newLeft });
  });
  const [animateDrag, setPos] = useSpring(() => ({
    left: 0,
  }));

  return (
    <FelaComponent style={[style.slider, externalStyle]}>
      {({ className }) => (
        <div className={className} {...props}>
          <FelaComponent style={style.inner}>
            {({ className }) => (
              <animated.div
                className={className}
                ref={innerRef}
                style={animateDrag}
                {...dragBinder(innerRef)}
              >
                {children}
              </animated.div>
            )}
          </FelaComponent>
        </div>
      )}
    </FelaComponent>
  );
};
