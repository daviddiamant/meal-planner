import React, { useRef } from "react";
import { FelaComponent } from "react-fela";
import { Link } from "react-router-dom";
import { animated, useSpring } from "react-spring";

// Local imports
import LazyLoadedImage from "../reduxConnections/lazyLoadedImage";

const style = {
  card: ({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    marginRight: `${theme.sliderCardMargin}px`,
    overflow: "hidden",
    borderRadius: `${theme.primary.borderRadius}px`,
    background: theme.quaternaryColors.grey,
  }),
};

export const SliderCard = ({
  index,
  data,
  height,
  onRest,
  lazyLoadedStateKey,
}) => {
  const {
    slug,
    title,
    mediumImage,
    smallImage,
    mediumImageWidth,
    mediumImageHeight,
  } = data;
  const prevWidth = useRef(0);

  const url = `${window.location.protocol}//${window.location.hostname}`;

  const ratio = mediumImageHeight / mediumImageWidth;

  let scaledWidth = 0;
  let scaledHeight = 0;
  let width = 0;
  if (ratio < 0.8) {
    // Too wide
    scaledWidth = Math.round(height / ratio, 0);
    scaledHeight = height;
    width = Math.round(height / 0.8, 0);
  } else if (ratio > 1.33) {
    // Too narrow
    width = Math.round(height / 1.33, 0);
    scaledWidth = width;
    scaledHeight = Math.round(scaledWidth * ratio, 0);
  } else {
    // No zoom
    width = slug ? Math.round(height / ratio, 0) : height;
    scaledHeight = height;
    scaledWidth = width;
  }

  const toStyle = {
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
  };

  // Animate width change
  const [animateWidth, setWidth] = useSpring(() => ({
    width,
    height,
    onRest,
  }));

  if (prevWidth.current !== width) {
    setWidth({ width });
  }
  prevWidth.current = width;

  return (
    <Link to={`/recipe/${slug}`}>
      <FelaComponent key={index} style={style.card}>
        {({ className: cardClasses }) => (
          <animated.div className={cardClasses} style={animateWidth}>
            <LazyLoadedImage
              src={url + mediumImage}
              smallSrc={url + smallImage}
              alt={title}
              stateKey={lazyLoadedStateKey}
              {...toStyle}
            />
          </animated.div>
        )}
      </FelaComponent>
    </Link>
  );
};
