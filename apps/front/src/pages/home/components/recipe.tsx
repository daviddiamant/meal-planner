import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { LazyImage } from "../../../components";
import { styled } from "../../../stitches.config";
import { Recipe as TRecipe } from "../../../types";

const Wrapper = styled(motion.div, {
  position: "relative",
  display: "block",
  width: "100%",
  aspectRatio: 1,
  marginBottom: "$2",
  background: "$foreground",
  borderRadius: "$primary",
  overflow: "hidden",
  opacity: 0,
});

export const Recipe = ({
  recipe: {
    calculatedHeight,
    calculatedWidth,
    mediumImage,
    slug,
    smallImage,
    title,
  },
}: {
  recipe: TRecipe;
}) => (
  <Link to={`/recipe/${slug}`}>
    <Wrapper
      animate={{ opacity: 1 }}
      css={{
        height: `${calculatedHeight}px`,
        width: `${calculatedWidth}px`,
      }}
      data-testid={slug}
      role="gridcell"
      transition={{ type: "spring", duration: 0.25 }}
    >
      {mediumImage && smallImage && (
        <LazyImage alt={title} largeUrl={mediumImage} smallUrl={smallImage} />
      )}
    </Wrapper>
  </Link>
);
