import React, { useRef } from "react";
import { FelaComponent } from "react-fela";
import { useSpring, animated } from "react-spring";
import { useDrag } from "react-use-gesture";

const style = {
  swipeAreaWrapper: {
    width: "100%",
    overflow: "hidden",
  },
  swipeArea: ({ numChildren }) => ({
    position: "relative",
    display: "flex",
    width: `${numChildren * 100}%`,
  }),
  swipeAreaItem: ({ theme }) => ({
    ...theme.constrained,
    margin: 0,
    padding: `0 ${theme.constrainedMargin + 6}px 0 ${
      theme.constrainedMargin + 6
    }px`,
  }),
};

const SwipeItem = ({
  children,
  index,
  indexOfSelected,
  maxIndex,
  set,
  callbacks,
}) => {
  // Ensure integers
  index = parseInt(index);
  indexOfSelected = parseInt(indexOfSelected);

  // Will be true if a swipe has been detected
  const hadSwipeRight = useRef(false);
  const hadSwipeLeft = useRef(false);

  const itemRef = useRef(null);

  const dragBinder = useDrag(({ down, movement, velocity }) => {
    if (index !== indexOfSelected) {
      // Only react to drag on the selected view
      return null;
    }

    if (
      velocity > 1 &&
      (movement[0] > 10 || movement[0] < -10) &&
      movement[1] < 100 &&
      movement[1] > -100
    ) {
      if (movement[0] > 10) {
        hadSwipeLeft.current = true;
      } else if (movement[0] < -10) {
        hadSwipeRight.current = true;
      }
    } else {
      hadSwipeLeft.current = false;
      hadSwipeRight.current = false;
    }

    const changeInPercent = (movement[0] / itemRef.current.offsetWidth) * 100;
    if (down && (movement[0] > 45 || movement[0] < -45)) {
      // We have not removed the finger yet
      set({
        left: `${changeInPercent + indexOfSelected * -100}%`,
      });
    } else if (
      !down &&
      index === 0 &&
      (changeInPercent > 0 || hadSwipeLeft.current)
    ) {
      // We cant go more to the left than 0 - bounce back
      set({
        left: "0%",
      });
    } else if (
      !down &&
      index === maxIndex &&
      (changeInPercent < 0 || hadSwipeRight.current)
    ) {
      // We cant go more to the right than 0 - bounce back
      set({
        left: `${indexOfSelected * -100}%`,
      });
    } else if (!down && hadSwipeLeft.current) {
      // Fast swipe
      // Go left
      set({
        left: `${(indexOfSelected - 1) * -100}%`,
      });
      callbacks[indexOfSelected - 1]();
    } else if (!down && hadSwipeRight.current) {
      // Fast swipe
      // Go right
      set({
        left: `${(indexOfSelected + 1) * -100}%`,
      });
      callbacks[indexOfSelected + 1]();
    } else if (!down && changeInPercent > 0 && changeInPercent < 50) {
      // Slow swipe
      // Not enough left! Go back
      set({
        left: `${indexOfSelected * -100}%`,
      });
    } else if (!down && changeInPercent < 0 && changeInPercent > -50) {
      // Slow swipe
      // Not enough right! Go back
      set({
        left: `${indexOfSelected * -100}%`,
      });
    } else if (!down && changeInPercent > 0) {
      // Slow swipe
      // Go left
      set({
        left: `${(indexOfSelected - 1) * -100}%`,
      });
      callbacks[indexOfSelected - 1]();
    } else if (!down && changeInPercent < 0) {
      // Slow swipe
      // Go right
      set({
        left: `${(indexOfSelected + 1) * -100}%`,
      });
      callbacks[indexOfSelected + 1]();
    }

    // Reset swipe detextion
    if (!down) {
      hadSwipeLeft.current = false;
      hadSwipeRight.current = false;
    }
  });

  return (
    <FelaComponent style={style.swipeAreaItem}>
      {({ className }) => (
        <div ref={itemRef} className={className} {...dragBinder(itemRef)}>
          {children}
        </div>
      )}
    </FelaComponent>
  );
};

export const SwipeArea = ({ children, selected, selectionCallbacks }) => {
  // Get the index of the selected child
  let indexOfSelected;
  for (const i in children) {
    if (children[i].props.type === selected) {
      indexOfSelected = i;
      break;
    }
  }
  const prevSelected = useRef(indexOfSelected);

  // Spring for animation
  const [spring, set] = useSpring(() => ({
    left: `-${indexOfSelected * 100}%`,
  }));

  // React to updates
  if (prevSelected.current !== indexOfSelected) {
    set({
      left: `-${indexOfSelected * 100}%`,
    });
    prevSelected.current = indexOfSelected;
  }

  return (
    <FelaComponent style={style.swipeAreaWrapper}>
      <FelaComponent style={style.swipeArea} numChildren={children.length}>
        {({ className }) => (
          <animated.div className={className} style={spring}>
            {children.map((swipeItem, i) => (
              <SwipeItem
                key={i}
                index={i}
                indexOfSelected={indexOfSelected}
                maxIndex={children.length - 1}
                set={set}
                callbacks={selectionCallbacks}
              >
                {swipeItem}
              </SwipeItem>
            ))}
          </animated.div>
        )}
      </FelaComponent>
    </FelaComponent>
  );
};
