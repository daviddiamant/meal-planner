import { motion } from "framer-motion";
import { useState } from "react";

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
}: LazyImageProps) => {
  // Keep it in state to trigger a re-hook of useHasIntersected
  const [wrapperRef, setWrapperRef] = useState<HTMLDivElement | null>(null);

  const smallShown = useHasIntersected(wrapperRef, 100, {
    rootMargin: "1000px",
  });
  const shown = useHasIntersected(wrapperRef, 400, {
    rootMargin: "600px",
  });

  return (
    <ImageWrapper ref={(ref) => ref && setWrapperRef(ref)}>
      {smallShown && (
        <Image
          alt={`Förhandsvisning - ${alt}`}
          animate={{ opacity: 1 }}
          small={true}
          src={IMAGE_URL + smallUrl}
          transition={{ type: "spring", duration: 0.2 }}
        />
      )}
      {shown && (
        <Image
          alt={alt}
          animate={{ opacity: 1 }}
          src={IMAGE_URL + largeUrl}
          transition={{ type: "spring", duration: 0.2 }}
          onAnimationComplete={onDisplayed}
        />
      )}
    </ImageWrapper>
  );
};
