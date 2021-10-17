import { motion } from "framer-motion";
import { useRef } from "react";

import { IMAGE_URL } from "../../appConfig";
import { useHasIntersected } from "../../hooks";
import { styled } from "../../stitches.config";

export interface LazyImageProps {
  alt: string;
  largeUrl: string;
  smallUrl: string;
  storybook?: boolean;
}

const ImageWrapper = styled("div", {
  position: "relative",
  minHeight: "1px",
  width: "100%",
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
  smallUrl,
  storybook,
}: LazyImageProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const smallShown = useHasIntersected(wrapperRef.current, 100, {
    rootMargin: "1000px",
  });
  const shown = useHasIntersected(wrapperRef.current, 400, {
    rootMargin: "600px",
  });

  return (
    <ImageWrapper ref={wrapperRef}>
      {(smallShown || storybook) && (
        <Image
          alt={`Förhandsvisning - ${alt}`}
          animate={{ opacity: 1 }}
          small={true}
          src={IMAGE_URL + smallUrl}
          transition={{ type: "spring", duration: 0.2 }}
        />
      )}
      {(shown || storybook) && (
        <Image
          alt={alt}
          animate={{ opacity: 1 }}
          src={IMAGE_URL + largeUrl}
          transition={{ type: "spring", duration: 0.2 }}
        />
      )}
    </ImageWrapper>
  );
};
