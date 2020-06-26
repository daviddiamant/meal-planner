import React, { useContext, useEffect, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { animated, useSpring, useTransition } from "react-spring";

// Local imports
import { Btn } from "./btn";
import { LoadingDots } from "./loadingDots";

const addPadding = 30;
const style = {
  addWrapper: ({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: `${addPadding}px`,
    background: theme.quaternaryColors.grey,
    borderRadius: `${theme.primary.borderRadius}px`,
  }),
  inputWrapper: {
    flex: 1,
    paddingRight: `${addPadding}px`,
  },
  addTitle: () => ({}),
  addInput: ({ theme }) => {
    const height = 35;
    return {
      boxSizing: "border-box",
      width: "100%",
      height: `${height}px`,
      padding: "0 10px",
      margin: "10px 1px 1px 1px",
      color: theme.textColors.secondary,
      textTransform: "lowercase",
      border: "none",
      borderRadius: `${theme.primary.borderRadius}px`,
      "::placeholder": {
        color: theme.textColors.tertiary,
        textTransform: "none",
      },
      ":focus": {
        margin: "9px 0 0 0",
        height: `${height + 2}px`,
        outline: "none",
        shadow: "none",
        border: `1px solid ${theme.secondaryColors.yellow}`,
      },
    };
  },
  addButton: () => ({
    width: "50px",
    height: "50px",
    padding: 0,
    borderRadius: "100%",
  }),
  addIcon: () => ({
    width: "24px",
    height: "24px",
  }),
};

export const AddRecipeBox = ({
  adding,
  currentUrl,
  showPlus,
  showDots,
  showCheck,
  showCross,
  onPlusOut,
  onDotsOut,
  onStatusOut,
  onInput,
  onAdd,
  externalRef,
  style: externalStyle,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const hasMounted = useRef(false);
  const urlInput = useRef();

  const onMount = () => {
    hasMounted.current = true;
  };
  useEffect(onMount, []);

  // Fade out + on add
  const fadeOutPlus = useTransition(showPlus, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onDestroyed: () => (fadeOutPlus[0].item ? onPlusOut() : null),
  });

  // Fade in ... on add
  const fadeInDot = useTransition(showDots, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onDestroyed: () => (fadeInDot[0].item ? onDotsOut() : null),
  });

  // Fade in ✓ on successful res
  const fadeInCheck = useTransition(showCheck, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onDestroyed: () => (fadeInCheck[0].item ? onStatusOut() : null),
  });

  // Fade in x on fail res
  const fadeInCross = useTransition(showCross, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onDestroyed: () => (fadeInCross[0].item ? onStatusOut() : null),
  });

  // Animate red color on fail
  const animateColor = useSpring({
    to: {
      background: showCross
        ? theme.primaryColors.red
        : theme.primaryColors.yellow,
    },
    from: {
      background: showCross
        ? theme.primaryColors.yellow
        : theme.primaryColors.red,
    },
    immediate: !hasMounted.current,
  });

  return (
    <FelaComponent style={[style.addWrapper, externalStyle]}>
      {({ className }) => (
        <div className={className} ref={externalRef} {...props}>
          <FelaComponent style={style.inputWrapper}>
            <FelaComponent
              style={[theme.helpers.resetHeaders, style.addTitle]}
              as="h4"
            >
              Lägg till recept
            </FelaComponent>
            <FelaComponent style={style.addInput}>
              {({ className }) => (
                <input
                  className={className}
                  type="text"
                  placeholder="Webbadress.."
                  onChange={() =>
                    /*This is needed to mute a warning, we use onInput here */ null
                  }
                  onInput={(e) => onInput(e.target.value)}
                  ref={urlInput}
                  value={currentUrl}
                ></input>
              )}
            </FelaComponent>
          </FelaComponent>
          <div>
            <Btn
              externalStyle={style.addButton}
              background={theme.primaryColors.yellow}
              // Only allow one click
              onClick={() => (!adding ? onAdd(currentUrl) : null)}
              style={animateColor}
            >
              {fadeOutPlus.map(
                ({ item, key, props }) =>
                  item && (
                    <FelaComponent style={style.addIcon} key={key}>
                      {({ className }) => (
                        <animated.svg
                          className={className}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          key={key}
                          style={props}
                        >
                          <path d="M12 4v16m8-8H4"></path>
                        </animated.svg>
                      )}
                    </FelaComponent>
                  )
              )}
              {fadeInDot.map(
                ({ item, key, props }) =>
                  item && <LoadingDots key={key} style={props} />
              )}
              {fadeInCheck.map(
                ({ item, key, props }) =>
                  item && (
                    <FelaComponent style={style.addIcon} key={key}>
                      {({ className }) => (
                        <animated.svg
                          className={className}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          key={key}
                          style={props}
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </animated.svg>
                      )}
                    </FelaComponent>
                  )
              )}
              {fadeInCross.map(
                ({ item, key, props }) =>
                  item && (
                    <FelaComponent style={style.addIcon} key={key}>
                      {({ className }) => (
                        <animated.svg
                          className={className}
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          key={key}
                          style={props}
                        >
                          <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
                        </animated.svg>
                      )}
                    </FelaComponent>
                  )
              )}
            </Btn>
          </div>
        </div>
      )}
    </FelaComponent>
  );
};
