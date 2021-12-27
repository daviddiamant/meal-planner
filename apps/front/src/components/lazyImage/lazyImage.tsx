import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

import { IMAGE_URL } from "../../appConfig";
import { useHasIntersected } from "../../hooks";
import { styled } from "../../stitches.config";

export interface LazyImageProps {
  alt: string;
  largeUrl: string;
  smallUrl: string;
  onDisplayed?: () => void;
}

const ImageWrapper = styled("div", {
  position: "relative",
  width: "100%",
  height: "100%",
});

const Image = styled(motion.img, {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "auto",
  opacity: 0,
  variants: {
    small: {
      true: {
        filter: "blur(2.5px) brightness(95%)",
      },
    },
  },
  defaultVariants: {
    small: false,
  },
});

export const LazyImage = ({
  alt,
  largeUrl,
  onDisplayed,
  smallUrl,
}: LazyImageProps): JSX.Element => {
  // Keep it in state to trigger a re-hook of useHasIntersected
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);

  const [smallLoaded, setSmallLoaded] = useState(false);
  const [largeLoaded, setLargeLoaded] = useState(false);
  const [smallAnimated, setSmallAnimated] = useState(false);

  const smallAnimation = useAnimation();
  const largeAnimation = useAnimation();

  const showSmall = useHasIntersected(wrapperRef, 100, {
    rootMargin: "1000px",
  });
  const showLarge = useHasIntersected(wrapperRef, 400, {
    rootMargin: "600px",
  });

  useEffect(() => {
    if (smallLoaded) smallAnimation.start({ opacity: 1 });
  }, [smallAnimation, smallLoaded]);

  useEffect(() => {
    if (largeLoaded && smallAnimated) largeAnimation.start({ opacity: 1 });
  }, [largeAnimation, largeLoaded, smallAnimated]);

  return (
    <ImageWrapper ref={(ref) => ref && setWrapperRef(ref)}>
      {showSmall && (
        <Image
          alt={`Förhandsvisning - ${alt}`}
          animate={smallAnimation}
          small={true}
          src={IMAGE_URL + smallUrl}
          transition={{ duration: 0.2 }}
          onAnimationComplete={() => {
            setSmallAnimated(true);

            onDisplayed && onDisplayed();
          }}
          onLoad={() => setSmallLoaded(true)}
        />
      )}
      {showLarge && (
        <Image
          alt={alt}
          animate={largeAnimation}
          src={IMAGE_URL + largeUrl}
          transition={{ duration: 0.3 }}
          onLoad={() => setLargeLoaded(true)}
        />
      )}
    </ImageWrapper>
  );
};
