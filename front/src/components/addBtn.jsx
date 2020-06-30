import React, { useContext, useEffect, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { animated, useTransition, useSpring } from "react-spring";

// Local imports
import { Btn } from "./btn";

const style = {
  inner: ({ theme }) => ({
    ...theme.helpers.flexCenterBoth,
  }),
};

const InnerContent = ({ style: externalStyle, inner }) => (
  <FelaComponent style={style.inner}>
    {({ className }) => (
      <animated.div className={className} style={externalStyle}>
        {inner ? inner(externalStyle) : null}
      </animated.div>
    )}
  </FelaComponent>
);

export const AddBtn = ({
  addContent,
  addingContent,
  successContent,
  failContent,
  value,
  addPath,
  adding,
  showAdd,
  showAdding,
  showSuccess,
  showFail,
  onAddOut,
  onAddingOut,
  onStatusOut,
  onAdd,
  style: externalStyle,
  background: externalBackground,
}) => {
  const theme = useContext(ThemeContext);
  const hasMounted = useRef(false);
  const onMount = () => {
    hasMounted.current = true;
  };
  useEffect(onMount, []);

  // Fade out add content on add
  const fadeOutAdd = useTransition(showAdd, null, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onDestroyed: () => (fadeOutAdd[0].item ? onAddOut() : null),
  });

  // Fade in loading on add
  const fadeInAdding = useTransition(showAdding, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onDestroyed: () => (fadeInAdding[0].item ? onAddingOut() : null),
  });

  // Fade in success content on successful res
  const fadeInSuccess = useTransition(showSuccess, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onDestroyed: () => (fadeInSuccess[0].item ? onStatusOut() : null),
  });

  // Fade in fail content on fail res
  const fadeInFail = useTransition(showFail, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onDestroyed: () => (fadeInFail[0].item ? onStatusOut() : null),
  });

  // Animate red color on fail
  const background = externalBackground || theme.primaryColors.yellow;
  const animateColor = useSpring({
    to: {
      background: showFail ? theme.primaryColors.red : background,
    },
    from: {
      background: showFail ? background : theme.primaryColors.red,
    },
    immediate: !hasMounted.current,
  });

  return (
    <Btn
      style={externalStyle}
      background={background}
      // Only allow one click
      onClick={() => (!adding ? onAdd(addPath, value) : null)}
      animationStyle={animateColor}
    >
      {fadeOutAdd.map(
        ({ item, key, props }) =>
          item && <InnerContent key={key} style={props} inner={addContent} />
      )}
      {fadeInAdding.map(
        ({ item, key, props }) =>
          item && <InnerContent key={key} style={props} inner={addingContent} />
      )}
      {fadeInSuccess.map(
        ({ item, key, props }) =>
          item && (
            <InnerContent key={key} style={props} inner={successContent} />
          )
      )}
      {fadeInFail.map(
        ({ item, key, props }) =>
          item && <InnerContent key={key} style={props} inner={failContent} />
      )}
    </Btn>
  );
};
