import React, { useEffect, useRef } from "react";
import { FelaComponent } from "react-fela";
import { useSpring, animated } from "react-spring";
import { useDispatch } from "react-redux";

// Local imports
import {
  lazyLoadImage,
  cleanUpLazyLoading,
  clearForLazyLargeImage,
  processLazyLoadSmallQueue,
  processLazyLoadLargeQueue,
} from "../actions/actionCreators";

const style = {
  background: ({ width, height, extraMargin, loaded }) => ({
    position: "relative",
    width,
    height,
    marginBottom: extraMargin && loaded ? 0 : "1px", // bug in masonic - will not display unless height change
  }),
  smallImage: {
    filter: "blur(2.5px) brightness(95%)",
  },
  image: {
    position: "absolute",
    width: "100%",
    height: "auto",
    top: 0,
    bottom: 0,
    left: 0,
  },
};

export const LazyLoadedImage = (props) => {
  const {
    className: parentClassName,
    alt,
    src,
    width,
    height,
    smallSrc,
    smallURL,
    stateKey,
    loadImage,
    crossOrigin,
    extraMargin,
    imageLoaded,
    autoLoadSmall,
    imageDisplayed,
    whenImageLoaded,
    whenImageDisplayed,
    startedLazyLoading,
  } = props;

  // Ensure pixels
  let formattedWidth;
  if (typeof width === "number") {
    formattedWidth = `${width}px`;
  } else {
    formattedWidth = width;
  }

  const started = useRef(0); // Should not trigger re-render
  const dispatch = useDispatch();
  const originObject = {};
  if (crossOrigin) {
    originObject.crossOrigin = crossOrigin;
  }

  // Should we auto load the small image on mount?
  const onMount = () => {
    if (autoLoadSmall) {
      dispatch(lazyLoadImage(src, smallSrc, stateKey));
      dispatch(processLazyLoadSmallQueue());
    }
    return () => {
      if (autoLoadSmall) {
        dispatch(cleanUpLazyLoading([], stateKey));
      }
    };
  };
  useEffect(onMount, []);

  // Should we auto load the large image on arrival of the small?
  const onSmallImageLoaded = () => {
    if (autoLoadSmall && smallURL) {
      dispatch(clearForLazyLargeImage(src, stateKey));
      dispatch(processLazyLoadLargeQueue());
    }
  };
  useEffect(onSmallImageLoaded, [smallURL]);

  // We want to fade in the small image
  const fadeInSmallImage = useSpring({
    from: { opacity: 0 },
    to: {
      opacity: smallURL ? 1 : 0,
    },
  });

  // We want to fade in the big image
  const fadeInLargeImage = useSpring({
    from: { opacity: 0 },
    to: {
      opacity: imageLoaded ? 1 : 0,
    },
    onFrame: () => {
      started.current = started.current + 1;
    },
    onRest: () => {
      if (started.current > 10) {
        // On rest is called onMount as well, so check for actual animation
        whenImageDisplayed();
        started.current = 0;
      }
    },
  });

  return (
    <FelaComponent
      style={style.background}
      width={formattedWidth}
      height={height}
      extraMargin={extraMargin}
      loaded={startedLazyLoading}
    >
      {({ className: childClassName }) => (
        <div className={`${parentClassName} ${childClassName}`}>
          {smallURL && !imageDisplayed ? (
            <FelaComponent style={[style.image, style.smallImage]}>
              {({ className }) => (
                <img
                  style={fadeInSmallImage}
                  className={className}
                  src={smallURL}
                  alt={alt}
                />
              )}
            </FelaComponent>
          ) : null}
          {loadImage ? (
            <FelaComponent style={style.image}>
              {({ className }) => (
                <animated.img
                  {...originObject}
                  style={fadeInLargeImage}
                  className={className}
                  src={src}
                  alt={alt}
                  onLoad={whenImageLoaded}
                />
              )}
            </FelaComponent>
          ) : null}
        </div>
      )}
    </FelaComponent>
  );
};
