import React, { useContext, useEffect, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "react-spring";
import { useWindowSize } from "@react-hook/window-size";

// Local imports
import {
  createExpandText,
  removeExpandText,
  toggleExpandText,
  changeHeightExpandText,
} from "../actions/actionCreators";

const iconHeight = 25;
const iconAngle = 50;
const lineThickness = 2;
const middleSpace = Math.cos((iconAngle * Math.PI) / 180) * lineThickness;
const oppositeSide = Math.tan(((90 - 60) * Math.PI) / 180) * (iconHeight / 2);
const hypotenuse = Math.sqrt(oppositeSide ** 2 + (iconHeight / 2) ** 2);
const style = {
  expanderSection: {
    position: "relative",
    display: "inline-block",
    marginBottom: `${25 + iconHeight / 2}px`,
  },
  outer: ({ theme }) => ({
    position: "relative",
    lineHeight: theme.primaryLineHeight,
    fontSize: theme.primaryFontSize,
    overflow: "hidden",
  }),
  expand: ({ theme, numLines }) => ({
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    height: `${
      numLines < 2 ? theme.primaryLineHeight : theme.primaryLineHeight * 2
    }rem`,
    bottom: "0",
    background: theme.background,
  }),
  expandIcon: () => ({
    position: "relative",
    top: "95%",
    width: `${iconHeight}px`,
    height: `${iconHeight}px`,
  }),
  expandIconLine: ({ theme }) => ({
    position: "relative",
    margin: "auto",
    width: `${lineThickness}px`,
    height: `${hypotenuse + 2 * middleSpace}px`,
    background: theme.textColors.tertiary,
    borderRadius: `${lineThickness / 2}px`,
  }),
  lineWrapper: {
    position: "absolute",
    top: 0,
    width: "50%",
    height: `${iconHeight}px`,
    overflow: "hidden",
  },
  lineLeft: {
    left: `${middleSpace}px`,
    transform: `rotate(-${iconAngle}deg)`,
  },
  lineRightWrapper: {
    left: `${iconHeight / 2}px`,
  },
  lineRight: {
    left: `-${middleSpace}px`,
    transform: `rotate(${iconAngle}deg)`,
  },
};

export const ExpandText = ({ children, numLines }) => {
  const theme = useContext(ThemeContext);
  const [windowWidth] = useWindowSize();
  const innerRef = useRef({ offsetHeight: 0 });
  const outerRef = useRef({ offsetHeight: 0 });
  const uid = useRef(-1);
  const numAnimations = useRef(0);

  const onAnimationRest = () => {
    // If we have a uid we are mounted
    if (!expanded && uid.current > -1) {
      // The height are the same when we are expanded
      dispatch(
        changeHeightExpandText(
          uid.current,
          outerRef.current.offsetHeight,
          innerRef.current.offsetHeight
        )
      );
    }
    numAnimations.current++;
  };
  const onMount = () => {
    uid.current = currentMax;
    dispatch(createExpandText());
    onAnimationRest();
    return () => {
      dispatch(removeExpandText());
    };
  };

  useEffect(onMount, []);

  // Let's use the redux hooks here. (Nowhere else, but the refs do not work otherwise)
  const dispatch = useDispatch();
  const currentMax = useSelector((state) => state.expandText.numExpanders);
  const expanded = useSelector((state) =>
    state.expandText.expanderState[uid.current]
      ? state.expandText.expanderState[uid.current].expanded
      : false
  );
  const showExpand = useSelector((state) =>
    state.expandText.expanderState[uid.current]
      ? state.expandText.expanderState[uid.current].showExpandIcon
      : false
  );

  const expandHeight = useSpring({
    to: {
      maxHeight: !expanded
        ? `${
            numLines *
            (parseFloat(theme.primaryFontSize) *
              parseFloat(windowWidth) *
              0.01 *
              parseFloat(theme.primaryLineHeight))
          }px`
        : `${innerRef.current.offsetHeight}px`,
    },
    from: {
      maxHeight: !expanded
        ? `${innerRef.current.offsetHeight}px`
        : `${
            numLines *
            (parseFloat(theme.primaryFontSize) *
              parseFloat(windowWidth) *
              0.01 *
              parseFloat(theme.primaryLineHeight))
          }px`,
    },
    immediate: numAnimations.current < 1, // Do not animate on mount
    onRest: onAnimationRest,
    config: { duration: 250 },
  });

  const expandFade = useSpring({
    to: {
      background: !expanded
        ? `linear-gradient(0deg, ${
            theme.background
          } 0%, ${theme.background.split(",").slice(0, 3).join(",")},0) 100%)`
        : `linear-gradient(0deg, ${
            theme.background
          } 0%, ${theme.background.split(",").slice(0, 3).join(",")},0) 0%)`,
    },
    from: {
      background: !expanded
        ? `linear-gradient(0deg, ${
            theme.background
          } 0%, ${theme.background.split(",").slice(0, 3).join(",")},0) 0%)`
        : `linear-gradient(0deg, ${
            theme.background
          } 0%, ${theme.background.split(",").slice(0, 3).join(",")},0) 100%)`,
    },
    immediate: numAnimations.current < 1, // Do not animate on mount
  });

  const expandRotateLeft = useSpring({
    to: {
      transform: !expanded
        ? `rotate(-${iconAngle}deg)`
        : `rotate(${iconAngle}deg)`,
    },
    from: {
      transform: !expanded
        ? `rotate(${iconAngle}deg)`
        : `rotate(-${iconAngle}deg)`,
    },
    immediate: numAnimations.current < 1, // Do not animate on mount
  });

  const expandRotateRight = useSpring({
    to: {
      transform: !expanded
        ? `rotate(${iconAngle}deg)`
        : `rotate(-${iconAngle}deg)`,
    },
    from: {
      transform: !expanded
        ? `rotate(-${iconAngle}deg)`
        : `rotate(${iconAngle}deg)`,
    },
    immediate: numAnimations.current < 1, // Do not animate on mount
  });

  return (
    <FelaComponent style={style.expanderSection}>
      <FelaComponent style={style.outer}>
        {({ className }) => (
          <animated.div
            style={expandHeight}
            ref={outerRef}
            className={className}
          >
            <div ref={innerRef}>{children}</div>
          </animated.div>
        )}
      </FelaComponent>
      {showExpand ? (
        <FelaComponent style={style.expand} numLines={numLines}>
          {({ className }) => (
            <animated.div
              className={className}
              onClick={(e) => {
                dispatch(toggleExpandText(uid.current));
                e.persist();
              }}
              style={expandFade}
            >
              <FelaComponent style={style.expandIcon}>
                <FelaComponent
                  style={[style.lineWrapper, style.lineLeftWrapper]}
                >
                  <FelaComponent style={[style.expandIconLine, style.lineLeft]}>
                    {({ className }) => (
                      <animated.div
                        className={className}
                        style={expandRotateLeft}
                      ></animated.div>
                    )}
                  </FelaComponent>
                </FelaComponent>
                <FelaComponent
                  style={[style.lineWrapper, style.lineRightWrapper]}
                >
                  <FelaComponent
                    style={[style.expandIconLine, style.lineRight]}
                  >
                    {({ className }) => (
                      <animated.div
                        className={className}
                        style={expandRotateRight}
                      ></animated.div>
                    )}
                  </FelaComponent>
                </FelaComponent>
              </FelaComponent>
            </animated.div>
          )}
        </FelaComponent>
      ) : null}
    </FelaComponent>
  );
};
