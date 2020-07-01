import React, { useContext, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { Link } from "react-router-dom";
import { animated, useSpring, useTransition } from "react-spring";

// Local imports
import LazyLoadedImage from "../reduxConnections/lazyLoadedImage";

const iconDimension = 50;
const style = {
  card: ({ theme }) => ({
    position: "relative",
    overflow: "hidden",
    borderRadius: `${theme.primary.borderRadius}px`,
    background: theme.quaternaryColors.grey,
  }),
  buttons: ({ theme }) => ({
    ...theme.helpers.flexCenterBoth,
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    padding: "10px 20px",
    boxSizing: "border-box",
    flexWrap: "wrap",
    ...theme.helpers.hexToRgba({
      key: "background",
      hex: theme.primaryColors.yellow,
      a: 0.125,
    }),
  }),
  buttonIcon: ({ theme }) => ({
    width: `${iconDimension}px`,
    height: `${iconDimension}px`,
    color: theme.buttonColors.light,
  }),
  expandIcon: () => {
    const newDimension = iconDimension * 1.125;

    return {
      width: `${newDimension}px`,
      height: `${newDimension}px`,
      marginTop: `-${(iconDimension - newDimension) / 2}px`,
    };
  },
};

export const SliderCard = ({
  key,
  data,
  height,
  onRest,
  isFaded,
  onClick,
  onDelete,
  isClicked,
  isDeleted,
  onDeleteDone,
  onFadeOutDone,
  lazyLoadedStateKey,
  style: externalStyle,
}) => {
  const {
    slug,
    title,
    mediumImage,
    smallImage,
    mediumImageWidth,
    mediumImageHeight,
  } = data;
  const theme = useContext(ThemeContext);
  const prevWidth = useRef(0);
  const url = `${window.location.protocol}//${window.location.hostname}`;
  const ratio = mediumImageHeight / mediumImageWidth;

  let scaledWidth = 0;
  let scaledHeight = 0;
  let width = 0;
  if (ratio < 0.8) {
    // Too wide
    scaledWidth = parseInt(height / ratio);
    scaledHeight = height;
    width = parseInt(height / 0.8);
  } else if (ratio > 1.33) {
    // Too narrow
    width = parseInt(height / 1.33);
    scaledWidth = width;
    scaledHeight = parseInt(scaledWidth * ratio);
  } else {
    // No zoom
    width = slug ? parseInt(height / ratio) : height;
    scaledHeight = height;
    scaledWidth = width;
  }

  const toStyle = {
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
  };

  // Animate width change
  const [animateWidth, setWidth] = useSpring(() => {
    return {
      width,
      height,
      onRest,
    };
  });

  // Add blur on click
  const { filter: blurOnClick } = useSpring({
    from: { filter: [0, 100] },
    to: {
      filter: isClicked ? [2, 95] : [0, 100],
    },
  });

  // Fade in buttons on click
  const fadeInButtons = useTransition(isClicked, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  // Delete animations
  const fadeOut = useSpring({
    from: { opacity: isDeleted ? 1 : 0 },
    to: { opacity: isDeleted ? 0 : 1 },
    onRest: isDeleted ? onFadeOutDone : null,
  });
  const animateMarginAway = useSpring({
    from: { marginRight: isFaded ? `${theme.sliderCardMargin}px` : "0px" },
    to: { marginRight: isFaded ? "0px" : `${theme.sliderCardMargin}px` },
    onRest: isFaded ? onDeleteDone : null,
  });

  if (prevWidth.current !== width) {
    setWidth({ width });
  }
  prevWidth.current = width;

  return (
    <FelaComponent key={key} style={[externalStyle, style.card]}>
      {({ className: cardClasses }) => (
        <animated.div
          className={cardClasses}
          style={{ ...animateWidth, ...animateMarginAway, ...fadeOut }}
          onClick={onClick}
        >
          <animated.div
            style={{
              position: "relative",
              ...animateWidth,
              filter: blurOnClick.interpolate(
                (blur, brightness) =>
                  `blur(${blur}px) brightness(${brightness}%)`
              ),
            }}
          >
            <LazyLoadedImage
              src={url + mediumImage}
              smallSrc={url + smallImage}
              alt={title}
              stateKey={lazyLoadedStateKey}
              containerWidth={width}
              containerHeight={height}
              {...toStyle}
            />
          </animated.div>
          {fadeInButtons.map(
            ({ item, key, props }) =>
              item && (
                <FelaComponent style={style.buttons} key={key}>
                  {({ className }) => (
                    <animated.div className={className} style={props}>
                      <FelaComponent
                        style={[style.buttonIcon, style.expandIcon]}
                      >
                        {({ className }) => (
                          <Link to={`/recipe/${slug}`} className={className}>
                            <svg
                              className={className}
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
                            </svg>
                          </Link>
                        )}
                      </FelaComponent>
                      <FelaComponent style={style.buttonIcon}>
                        {({ className }) => (
                          <svg
                            className={className}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            onClick={isClicked ? onDelete : null}
                          >
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        )}
                      </FelaComponent>
                    </animated.div>
                  )}
                </FelaComponent>
              )
          )}
        </animated.div>
      )}
    </FelaComponent>
  );
};
