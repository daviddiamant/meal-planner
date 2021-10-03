import { motion } from "framer-motion";
import { RefObject } from "react";

import { IMAGE_URL } from "../../../appConfig";
import { useHasIntersected } from "../../../hooks";
import { styled } from "../../../stitches.config";
import { Recipe } from "../../../types";

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

export const RecipeImage = ({
  recipe: { mediumImage, smallImage, title },
  wrapperRef,
}: {
  recipe: Recipe;
  wrapperRef: RefObject<HTMLDivElement>;
}) => {
  const smallShown = useHasIntersected(wrapperRef.current, 100, {
    rootMargin: "1000px",
  });
  const shown = useHasIntersected(wrapperRef.current, 400, {
    rootMargin: "600px",
  });

  return (
    <>
      {smallShown && (
        <Image
          src={IMAGE_URL + smallImage}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", duration: 0.2 }}
          alt={`Förhandsvisning för receptet "${title}"`}
          small={true}
        />
      )}
      {shown && (
        <Image
          src={IMAGE_URL + mediumImage}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", duration: 0.2 }}
          alt={`Bild för receptet "${title}"`}
        />
      )}
    </>
  );
};
