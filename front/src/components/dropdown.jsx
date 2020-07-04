import React, { useContext, useEffect, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { animated, useSpring } from "react-spring";

const style = {
  dropdown: ({ theme, top, right }) => ({
    position: "absolute",
    top: `${top}px`,
    right: `${right}px`,
    background: theme.background,
    "-webkit-box-shadow": "0px 1px 8px -1px rgba(0,0,0,0.2)",
    "-moz-box-shadow": "0px 1px 8px -1px rgba(0,0,0,0.2)",
    boxShadow: "0px 1px 8px -1px rgba(0,0,0,0.2)",
    borderRadius: `${theme.primary.borderRadius}px`,
    overflow: "hidden",
  }),
  inner: () => ({}),
};

export const Dropdown = ({
  children,
  shouldOpen,
  isOpen,
  trigger,
  open,
  shouldClose,
  onOpened,
}) => {
  const theme = useContext(ThemeContext);
  const dropdown = useRef();
  const mounted = useRef(false);

  const onMount = () => {
    mounted.current = true;
  };
  useEffect(onMount, []);

  // Set up on-click to open dropdown
  const onTriggerClick = () => {
    if (!isOpen) {
      open();
    } else {
      shouldClose();
    }
  };
  const onTriggerChange = () => {
    let dropdownButton;

    if (trigger.current) {
      dropdownButton = trigger.current;
      dropdownButton.addEventListener("click", onTriggerClick);
    }
    return () => {
      dropdownButton.removeEventListener("click", onTriggerClick);
    };
  };
  useEffect(onTriggerChange, [trigger, isOpen]);

  // Animte slide out
  const offsetHeight = dropdown.current?.offsetHeight || 0;
  const slideOutOnMount = useSpring({
    from: {
      height: shouldOpen || isOpen ? 0 : offsetHeight,
      padding: shouldOpen || isOpen ? "0px" : `${theme.dropdownPadding}px`,
    },
    to: {
      height: shouldOpen || isOpen ? offsetHeight : 0,
      padding: shouldOpen || isOpen ? `${theme.dropdownPadding}px` : "0px",
    },
    onRest: shouldOpen ? onOpened : null,
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    immediate: !mounted.current,
  });

  // Get the position of the dropdown
  const triggerStyle = trigger.current
    ? window.getComputedStyle(trigger.current)
    : null;
  const top = triggerStyle
    ? trigger.current?.offsetTop +
      trigger.current?.offsetHeight +
      parseInt(triggerStyle.getPropertyValue("margin-top")) +
      parseInt(triggerStyle.getPropertyValue("margin-bottom"))
    : 0;
  const right = triggerStyle
    ? trigger.current?.offsetParent?.offsetWidth -
      trigger.current?.offsetLeft -
      trigger.current?.offsetWidth -
      parseInt(triggerStyle.getPropertyValue("margin-left")) -
      parseInt(triggerStyle.getPropertyValue("margin-right"))
    : 0;

  return top ? (
    <FelaComponent style={style.dropdown} top={top} right={right}>
      {({ className }) => (
        <animated.div className={className} style={slideOutOnMount}>
          <FelaComponent style={style.inner}>
            {({ className }) => (
              <div className={className} ref={dropdown}>
                {children}
              </div>
            )}
          </FelaComponent>
        </animated.div>
      )}
    </FelaComponent>
  ) : null;
};
