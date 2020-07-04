import React, { useRef } from "react";
import { FelaComponent } from "react-fela";
import { animated, useSpring } from "react-spring";

const style = {
  item: ({ theme }) => ({
    ...theme.helpers.flexCenterBoth,
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: "5px",
    padding: "8px 10px",
    background: theme.quaternaryColors.grey,
    borderRadius: `${theme.primary.borderRadius - theme.dropdownPadding}px`,
    ":last-child": {
      marginBottom: "0",
    },
  }),
  icon: () => ({
    width: "20px",
    height: "20px",
    marginRight: "10px",
  }),
};

export const DropdownItem = ({
  display,
  icon,
  children,
  onFadeout,
  onClick,
  shouldCloseDropdown,
}) => {
  const haveBeenDisplayed = useRef(false);

  const fadeIn = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: display ? 1 : 0,
    },
    config: { mass: 1, tension: 120, friction: 14, clamp: true },
    onRest: () => {
      if (!display && haveBeenDisplayed.current) {
        // Only do this if the component comes from a displayed state and is going to a hidden state
        onFadeout();

        haveBeenDisplayed.current = false;
      }
    },
  });

  if (display) {
    // Mark that at some point the component have been displayed
    haveBeenDisplayed.current = true;
  }

  return (
    <FelaComponent style={style.item}>
      {({ className }) => (
        <animated.button
          className={className}
          style={fadeIn}
          onClick={() => {
            shouldCloseDropdown();
            try {
              // We do not know if this was passed in
              onClick();
            } catch (e) {
              /* Does not matter */
            }
          }}
        >
          {icon ? (
            <FelaComponent style={style.icon}>{icon}</FelaComponent>
          ) : null}
          {children}
        </animated.button>
      )}
    </FelaComponent>
  );
};
