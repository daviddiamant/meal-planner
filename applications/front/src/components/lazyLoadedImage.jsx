import React, { useEffect, useRef } from "react";
import { FelaComponent } from "react-fela";
import { useSpring, useTransition, animated } from "react-spring";

const style = {
  background: ({ width, height, extraMargin, loaded }) => ({
    position: "relative",
    width: typeof width === "string" ? width : `${width}px`,
    height: typeof height === "string" ? height : `${height}px`,
    marginBottom: extraMargin && loaded ? 0 : "1px", // bug in masonic - will not display unless height change
  }),
  centerHelper: ({ width, height, left, top }) => ({
    position: "absolute",
    left: `${left}px`,
    top: `${top}px`,
    width: typeof width === "string" ? width : `${width}px`,
    height: typeof height === "string" ? height : `${height}px`,
  }),
  smallImage: {
    filter: "blur(2.5px) brightness(95%)",
  },
  image: ({ width, height }) => ({
    position: "absolute",
    width: width ? (typeof width === "string" ? width : `${width}px`) : "100%",
    height: height
      ? typeof height === "string"
        ? height
        : `${height}px`
      : "auto",
    top: 0,
    bottom: 0,
    left: 0,
  }),
};

const ImagePart = ({
  wrap,
  containerWidth,
  containerHeight,
  width,
  height,
  children,
}) => {
  if (!wrap) {
    return children;
  }

  const left = parseInt((parseInt(containerWidth) - parseInt(width)) / 2);
  const top = parseInt((parseInt(containerHeight) - parseInt(height)) / 2);
  return (
    <FelaComponent
      style={style.centerHelper}
      width={width}
      height={height}
      left={left}
      top={top}
    >
      {children}
    </FelaComponent>
  );
};

export const LazyLoadedImage = (props) => {
  const {
    className: parentClassName,
    alt,
    src,
    width,
    height,
    children,
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
    containerWidth,
    imageDisplayed,
    containerHeight,
    whenImageLoaded,
    processSmallQueue,
    processLargeQueue,
    whenImageDisplayed,
    startedLazyLoading,
    clearOnUnmount = false,
  } = props;

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
      if (clearOnUnmount) {
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
          width={containerWidth || width}
          height={containerHeight || height}
          extraMargin={extraMargin}
          loaded={startedLazyLoading}
          isContainer={containerHeight && containerWidth}
        >
          {({ className: childClassName }) => (
            <animated.div
              key={key}
              style={props}
              className={`${parentClassName} ${childClassName}`}
            >
              <ImagePart
                wrap={containerHeight && containerWidth}
                containerHeight={containerHeight}
                containerWidth={containerWidth}
                width={width}
                height={height}
              >
                {smallURL && !imageDisplayed ? (
                  <FelaComponent
                    style={[style.image, style.smallImage]}
                    width={containerWidth ? width : null}
                    height={containerHeight ? height : null}
                  >
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
                  <FelaComponent
                    style={style.image}
                    width={containerWidth ? width : null}
                    height={containerHeight ? height : null}
                  >
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
              </ImagePart>
              {children}
            </animated.div>
          )}
        </FelaComponent>
      )
  );
};
