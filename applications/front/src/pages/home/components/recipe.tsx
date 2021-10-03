import { motion } from "framer-motion";
import { useRef } from "react";

import { styled } from "../../../stitches.config";
import { Recipe as TRecipe } from "../../../types";
import { RecipeImage } from ".";

const Wrapper = styled(motion.div, {
  position: "relative",
  display: "block",
  width: "100%",
  aspectRatio: 1,
  marginBottom: "$2",
  background: "$quaternaryGrey",
  borderRadius: "$primary",
  overflow: "hidden",
  opacity: 0,
});

export const Recipe = ({ recipe }: { recipe: TRecipe }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { calculatedHeight, calculatedWidth, mediumImage, slug, smallImage } =
    recipe;

  return (
    <Wrapper
      css={{
        height: `${calculatedHeight}px`,
        width: `${calculatedWidth}px`,
      }}
      animate={{ opacity: 1 }}
      transition={{ type: "spring", duration: 0.25 }}
      role="gridcell"
      ref={wrapperRef}
      data-testid={slug}
    >
      {mediumImage && smallImage && (
        <RecipeImage recipe={recipe} wrapperRef={wrapperRef} />
      )}
    </Wrapper>
  );
};
