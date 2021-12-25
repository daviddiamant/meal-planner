import useSize from "@react-hook/size";
import { useEffect, useRef, useState } from "react";
import { Puff } from "react-loading-icons";

import { Constrained } from "../../../components";
import { useHasIntersected, useRecipes } from "../../../hooks";
import { Style, styled, theme, utils } from "../../../stitches.config";
import { Recipe } from "../../../types";
import { Column } from ".";

const Grid = styled("div", {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
});
const Loading = styled(Puff, {
  width: "100%",
  height: "6.5vh",
  margin: "$2",
});
const style: Style = {
  constrained: {
    flexDirection: "column",
  },
};

export const Masonry = (): JSX.Element => {
  const recipesPerPage = 64;
  const gridRef = useRef(null);
  const endOfGridRef = useRef(null);

  const [heights, setHeights] = useState([0, 0]);
  const [moreRecipes, setMoreRecipes] = useState(true);
  const [left, setLeft] = useState<Recipe[]>([]);
  const [right, setRight] = useState<Recipe[]>([]);
  const [pagination, setPagination] = useState<[number, number]>([
    0,
    recipesPerPage,
  ]);

  const [gridWidth] = useSize(gridRef);
  const endShown = useHasIntersected(endOfGridRef.current, 0, {
    rootMargin: "1500px",
  });
  const { data: recipes, isLoading } = useRecipes(...pagination, (data) => {
    if (data?.length === 0) {
      setMoreRecipes(false);
    }
  });

  const imageMargin = utils.getNumericFromString(theme.space[2].value);
  const columnWidth = gridWidth / 2 - imageMargin / 2;

  useEffect(() => {
    if (!recipes || !gridWidth) {
      return;
    }

    const tempLeft = { height: heights[0], recipes: left };
    const tempRight = { height: heights[1], recipes: right };

    recipes.forEach((recipe) => {
      const column =
        tempLeft.height < tempRight.height ||
        tempLeft.height === tempRight.height
          ? tempLeft
          : tempRight;

      const ratio = recipe.mediumImageHeight / recipe.mediumImageWidth;
      const height = columnWidth * ratio;

      column.height += height;
      column.recipes.push({
        ...recipe,
        calculatedWidth: columnWidth,
        calculatedHeight: height,
      });
    });

    setHeights([tempLeft.height, tempRight.height]);
    setLeft(tempLeft.recipes);
    setRight(tempRight.recipes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipes, gridWidth]);

  useEffect(() => {
    if (endShown && moreRecipes) {
      setPagination(([, currentAmount]) => [
        currentAmount,
        currentAmount + recipesPerPage,
      ]);
    }
  }, [endShown, moreRecipes]);

  return (
    <Constrained css={style.constrained as any}>
      <Grid ref={gridRef} role="grid">
        <Column recipes={left} testId="left-column" />
        <Column
          loadMorePixelId={!isLoading ? pagination[1].toString() : undefined}
          loadMorePixelRef={endOfGridRef}
          recipes={right}
          testId="right-column"
        />
      </Grid>
      {isLoading && moreRecipes ? (
        <Loading stroke={theme.colors.primaryYellow.value} strokeWidth={5} />
      ) : (
        <Loading as="div" />
      )}
    </Constrained>
  );
};
