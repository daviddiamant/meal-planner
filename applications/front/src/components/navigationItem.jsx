import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FelaComponent } from "react-fela";
import { animated, useTransition } from "react-spring";

const style = {
  itemWrapper: ({ theme, navHeight }) => ({
    width: `${navHeight}px`,
    height: `${navHeight}px`,
    ...theme.helpers.flexCenterBoth,
    ...theme.helpers.noHighlight,
  }),
  item: ({ theme }) => ({
    width: "30px",
    height: "30px",
    color: theme.textColors.primary,
  }),
  selected: () => ({
    stroke: "url(#menyItemSelectedGradient)",
  }),
  background: ({ theme }) => ({
    width: "0",
    height: "0",
    position: "absolute",
    background: theme.secondaryColors.grey,
    zIndex: -1,
    borderRadius: "100%",
    opacity: 1,
  }),
};

export const NavigationItem = ({
  handleClick,
  clickDone,
  isClicked,
  navHeight,
  linkTo,
  selected,
  svgData,
  animationDone,
}) => {
  // Should not trigger re-render (as state do), so use ref
  const started = useRef(0);
  const startedOut = useRef(0);
  const touchEvents = useRef(false);

  // Transition on click
  const clickTransitions = useTransition(isClicked, null, {
    from: { opacity: 1, width: "0px", height: "0px" },
    enter: { width: `${navHeight * 1.25}px`, height: `${navHeight * 1.25}px` },
    leave: { opacity: 0 },
    onFrame: () => {
      if (isClicked) {
        started.current = started.current + 1;
      } else {
        startedOut.current = startedOut.current + 1;
      }
    },
    onRest: () => {
      if (started.current > 5) {
        // We actually had an animation
        clickDone();
        started.current = 0;
        touchEvents.current = false;
      } else if (startedOut.current > 5) {
        startedOut.current = 0;
        animationDone();
      }
    },
    config: { mass: 1, tension: 500, friction: 39, clamp: true },
  });

  return (
    <FelaComponent style={style.itemWrapper}>
      {({ className }) => (
        <Link
          to={linkTo}
          className={className}
          onMouseDown={() => {
            if (touchEvents.current) {
              // This will be handled by the touch event
              return null;
            }
            handleClick();
          }}
          onMouseUp={() => {
            if (touchEvents.current) {
              // This will be handled by the touch event
              return null;
            }
            clickDone();
          }}
          onTouchStart={() => {
            touchEvents.current = true;
            handleClick();
          }}
          onTouchEnd={() => {
            clickDone();
          }}
        >
          <FelaComponent style={style.background} navHeight={navHeight}>
            {({ className }) =>
              clickTransitions.map(
                ({ item, key, props }) =>
                  item && (
                    <animated.div
                      className={className}
                      key={key}
                      style={props}
                    />
                  )
              )
            }
          </FelaComponent>
          <FelaComponent style={style.item}>
            {({ className: menuItemClass }) => (
              <FelaComponent style={style.selected}>
                {({ className: selectedClass }) => (
                  <svg
                    className={menuItemClass}
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className={selected ? selectedClass : null}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={svgData}
                    ></path>
                  </svg>
                )}
              </FelaComponent>
            )}
          </FelaComponent>
        </Link>
      )}
    </FelaComponent>
  );
};
