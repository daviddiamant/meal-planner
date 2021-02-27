import React, { useRef } from "react";
import useScrollPosition from "@react-hook/window-scroll";
import range from "lodash/range";
import { useSpring, animated } from "react-spring";

const AnimatedContent = (props) => {
  const {
    inner,
    className,
    animateKeys,
    valueFormats,
    initialValues,
    handleOnScroll,
    spring: externalSpring,
  } = props;
  let { immediate } = props;

  // Default values
  immediate = immediate || Array(5).fill(false);

  const prevAnimatedContentProps = useRef(null);

  const initialSpringState = {
    config: { mass: 1, tension: 210, friction: 20 },
  };

  const keyToImmediate = {};
  for (const i in animateKeys) {
    initialSpringState[animateKeys[i]] = valueFormats[i](initialValues[i]);
    keyToImmediate[animateKeys[i]] = immediate[i];
  }

  initialSpringState["immediate"] = (key) => keyToImmediate[key];

  const propsAsJSON = JSON.stringify({
    animateKeys,
    valueFormats,
    initialValues,
  });

  let [spring, setAnimate] = useSpring(() => initialSpringState);
  if (prevAnimatedContentProps.current !== propsAsJSON) {
    // Seems to be a bug in useSpring
    setAnimate(initialSpringState);
  }

  const scrollY = useScrollPosition(60 /*fps*/);

  let [shouldUpdate, updatedAnimate] = handleOnScroll(
    scrollY,
    initialSpringState
  );

  if (shouldUpdate) {
    setAnimate(updatedAnimate);
    prevAnimatedContentProps.current = propsAsJSON;
  }

  return (
    <animated.div
      className={className}
      style={{ ...spring, ...externalSpring }}
    >
      {inner}
    </animated.div>
  );
};

const animateWithScroll = ({
  spring,
  children,
  className,
  immediate,
  stopValues,
  animateKeys,
  scrollRange,
  valueFormats,
  comeFromAbove,
  comeFromBelow,
  initialValues,
}) => {
  const breakpoint = parseInt(scrollRange.at);

  return (
    <AnimatedContent
      {...{
        spring,
        className,
        animateKeys,
        valueFormats,
        initialValues,
        immediate,
        inner: children,
        handleOnScroll: (scrollY) => {
          let hadUpdate = false;
          let newAnimationValue;
          const newSpringState = {};
          if (scrollY >= breakpoint && comeFromBelow.current) {
            hadUpdate = true;
            for (const i in animateKeys) {
              newAnimationValue = stopValues[i];
              newSpringState[animateKeys[i]] = valueFormats[i](
                newAnimationValue
              );
              comeFromAbove.current = true;
              comeFromBelow.current = false;
            }
          } else if (scrollY < breakpoint && comeFromAbove.current) {
            hadUpdate = true;
            for (const i in animateKeys) {
              newAnimationValue = initialValues[i];
              newSpringState[animateKeys[i]] = valueFormats[i](
                newAnimationValue
              );
              comeFromAbove.current = false;
              comeFromBelow.current = true;
            }
          }

          return [hadUpdate, newSpringState];
        },
      }}
    />
  );
};

const animateWithScrollRange = ({
  steps,
  spring,
  children,
  className,
  stopValues,
  animateKeys,
  scrollRange,
  shouldReset,
  valueFormats,
  initialValues,
}) => {
  // Make sure we have integers
  scrollRange = {
    min: parseInt(scrollRange.min),
    max: parseInt(scrollRange.max),
  };

  // Get the range for this animation
  const scrollValues = range(scrollRange.min, scrollRange.max);

  // Get the ranges for each value that should be animated
  let animationValues = [];
  let step = 0;
  if (!steps) {
    for (const i in animateKeys) {
      const asc = stopValues[i] > initialValues[i] ? true : false;
      const min = asc ? initialValues[i] : stopValues[i];
      const max = asc ? stopValues[i] : initialValues[i];
      step = parseInt(((max - min) / scrollValues.length) * 10000);
      step = asc ? step : -step;
      animationValues = [
        ...animationValues,
        range(initialValues[i] * 10000, stopValues[i] * 10000, step).map(
          (x) => x / 10000
        ),
      ];
    }
  } else {
    initialValues = [steps[0]];

    const stepKeys = Object.keys(steps).sort();
    let from;
    let to;
    let fromValue;
    let toValue;
    let startScroll;
    let stopScroll;
    let numOfThisAnimationValue;
    for (let i = 0; i < stepKeys.length - 1; i++) {
      from = stepKeys[i];
      to = stepKeys[i + 1];
      fromValue = steps[from];
      toValue = steps[to];
      startScroll = scrollValues.length * from;
      stopScroll = scrollValues.length * to;
      numOfThisAnimationValue = parseInt(stopScroll - startScroll);
      if (fromValue === toValue) {
        // Just fill it
        animationValues = [
          ...animationValues,
          ...Array(numOfThisAnimationValue).fill(fromValue),
        ];
      } else {
        const asc = toValue > fromValue ? true : false;
        const min = asc ? fromValue : toValue;
        const max = asc ? toValue : fromValue;
        step = parseInt(((max - min) / numOfThisAnimationValue) * 10000);
        step = asc ? step : -step;
        animationValues = [
          ...animationValues,
          ...range(fromValue * 10000, toValue * 10000, step).map(
            (x) => x / 10000
          ),
        ];
      }
    }
    animationValues = [animationValues];
  }

  return (
    <AnimatedContent
      {...{
        spring,
        className,
        animateKeys,
        valueFormats,
        initialValues,
        inner: children,
        handleOnScroll: (scrollY, initialSpringState) => {
          let hadUpdate = false;
          let newAnimationValue;
          let newSpringState = {};
          if (scrollY >= scrollRange.min && scrollY <= scrollRange.max) {
            for (const i in animateKeys) {
              newAnimationValue = animationValues[i][scrollY - scrollRange.min];
              if (newAnimationValue || (!newAnimationValue && !scrollY)) {
                hadUpdate = true;
                newSpringState[animateKeys[i]] = valueFormats[i](
                  newAnimationValue
                );
              }
            }
            if (hadUpdate) {
              shouldReset.current = true;
            }
          } else if (shouldReset.current && scrollY < scrollRange.min) {
            hadUpdate = true;
            shouldReset.current = false;
            newSpringState = initialSpringState;
          }

          return [hadUpdate, newSpringState];
        },
      }}
    />
  );
};

export const AnimateWithScroll = ({
  steps,
  spring,
  children,
  className,
  immediate,
  stopValues,
  animateKeys,
  scrollRange,
  valueFormats,
  initialValues,
}) => {
  // Should not trigger re-render (as state does)
  const shouldReset = useRef(false);
  const comeFromAbove = useRef(false);
  const comeFromBelow = useRef(true);

  // Default values
  immediate = immediate || Array(5).fill(false);

  // Make sure we have arrays
  animateKeys = Array.isArray(animateKeys) ? animateKeys : [animateKeys];
  initialValues = Array.isArray(initialValues)
    ? initialValues
    : [initialValues];
  stopValues = Array.isArray(stopValues) ? stopValues : [stopValues];
  valueFormats = Array.isArray(valueFormats) ? valueFormats : [valueFormats];
  immediate = Array.isArray(immediate) ? immediate : [immediate];

  if (scrollRange.at) {
    return animateWithScroll({
      spring,
      children,
      immediate,
      className,
      stopValues,
      animateKeys,
      scrollRange,
      valueFormats,
      comeFromAbove,
      comeFromBelow,
      initialValues,
    });
  } else {
    return animateWithScrollRange({
      steps,
      spring,
      children,
      className,
      stopValues,
      animateKeys,
      scrollRange,
      shouldReset,
      valueFormats,
      initialValues,
    });
  }
};
