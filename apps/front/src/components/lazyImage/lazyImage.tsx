import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

import { IMAGE_URL } from "../../appConfig";
import { useHasIntersected } from "../../hooks";
import { styled, StyledComponent } from "../../stitches.config";

export interface LazyImageProps {
  alt: string;
  largeUrl: string;
  smallUrl: string;
  onDisplayed?: () => void;
  useConfirmationTime?: boolean;
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

const LazyImageComponent = ({
  alt,
  largeUrl,
  onDisplayed,
  smallUrl,
  useConfirmationTime = true,
  ...restProps
}: StyledComponent<LazyImageProps, typeof ImageWrapper>): JSX.Element => {
  // Keep it in state to trigger a re-hook of useHasIntersected
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);

  const [smallLoaded, setSmallLoaded] = useState(false);
  const [largeLoaded, setLargeLoaded] = useState(false);
  const [smallAnimated, setSmallAnimated] = useState(false);

  const smallAnimation = useAnimation();
  const largeAnimation = useAnimation();

  // Only animate it if it is actually shown
  const animateSmall = useHasIntersected(
    wrapperRef,
    useConfirmationTime ? 100 : 0
  );
  const showSmall = useHasIntersected(
    wrapperRef,
    useConfirmationTime ? 100 : 0,
    {
      rootMargin: "1000px",
    }
  );
  const showLarge = useHasIntersected(
    wrapperRef,
    useConfirmationTime ? 500 : 0,
    {
      rootMargin: "200px",
    }
  );

  useEffect(() => {
    if (smallLoaded) smallAnimation.start({ opacity: 1 });
  }, [smallAnimation, smallLoaded]);

  useEffect(() => {
    if (largeLoaded && smallAnimated) largeAnimation.start({ opacity: 1 });
  }, [largeAnimation, largeLoaded, smallAnimated]);

  return (
    <ImageWrapper {...restProps} ref={(ref) => ref && setWrapperRef(ref)}>
      {showSmall && (
        <Image
          alt={`Förhandsvisning - ${alt}`}
          animate={smallAnimation}
          initial={{ opacity: 0 }}
          small={true}
          src={IMAGE_URL + smallUrl}
          transition={{ duration: animateSmall ? 0.15 : 0 }}
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
          initial={{ opacity: 0 }}
          src={IMAGE_URL + largeUrl}
          transition={{ duration: 0.2 }}
          onLoad={() => setLargeLoaded(true)}
        />
      )}
    </ImageWrapper>
  );
};

export const LazyImage = styled(LazyImageComponent);
