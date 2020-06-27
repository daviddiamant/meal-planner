import React, { useEffect, useRef } from "react";
import { FelaComponent } from "react-fela";
import { useSpring, useTransition, animated } from "react-spring";

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
    initLoad,
    smallSrc,
    smallURL,
    stateKey,
    loadImage,
    loadLarge,
    showImage,
    clearQueue,
    crossOrigin,
    extraMargin,
    imageLoaded,
    autoLoadSmall,
    imageDisplayed,
    whenImageLoaded,
    processSmallQueue,
    processLargeQueue,
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

  const originObject = {};
  if (crossOrigin) {
    originObject.crossOrigin = crossOrigin;
  }

  // Should we auto load the small image on mount?
  const onMount = () => {
    if (autoLoadSmall) {
      initLoad(src, smallSrc, stateKey);
      processSmallQueue();
    }
    return () => {
      if (autoLoadSmall) {
        clearQueue(stateKey);
      }
    };
  };
  useEffect(onMount, []);

  // Should we auto load the large image on arrival of the small?
  const onSmallImageLoaded = () => {
    if (autoLoadSmall && smallURL) {
      loadLarge(src, stateKey);
      processLargeQueue();
    }
  };
  useEffect(onSmallImageLoaded, [smallURL]);

  // Fade in small version of the image
  const fadeInImage = useTransition(showImage, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { mass: 1, tension: 280, friction: 60 },
  });

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

  return fadeInImage.map(
    ({ item, key, props }) =>
      item && (
        <FelaComponent
          key={key}
          style={style.background}
          width={formattedWidth}
          height={height}
          extraMargin={extraMargin}
          loaded={startedLazyLoading}
        >
          {({ className: childClassName }) => (
            <animated.div
              key={key}
              style={props}
              className={`${parentClassName} ${childClassName}`}
            >
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
            </animated.div>
          )}
        </FelaComponent>
      )
  );
};
