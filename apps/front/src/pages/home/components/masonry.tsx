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
  const gridRef = useRef(null);
  const endOfGridRef = useRef(null);

  const [heights, setHeights] = useState([0, 0]);
  const [noPagesAdded, pageAdded] = useState(0);
  const [left, setLeft] = useState<Recipe[]>([]);
  const [right, setRight] = useState<Recipe[]>([]);

  const [gridWidth] = useSize(gridRef);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useRecipes();
  const endShown = useHasIntersected(endOfGridRef.current, 0, {
    rootMargin: "1500px",
  });

  const imageMargin = utils.getNumericFromString(theme.space[2].value);
  const columnWidth = gridWidth / 2 - imageMargin / 2;

  useEffect(() => {
    if (!data?.pages || !gridWidth) {
      return;
    }

    const tempLeft = { height: heights[0], recipes: left };
    const tempRight = { height: heights[1], recipes: right };

    data.pages.slice(noPagesAdded).forEach((page) => {
      page.recipes.forEach((recipe) => {
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

      pageAdded((x) => x + 1);
    });

    setHeights([tempLeft.height, tempRight.height]);
    setLeft(tempLeft.recipes);
    setRight(tempRight.recipes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.pages, gridWidth]);

  useEffect(() => {
    if (endShown && hasNextPage) {
      fetchNextPage();
    }
  }, [endShown, fetchNextPage, hasNextPage]);

  return (
    <Constrained css={style.constrained}>
      <Grid ref={gridRef} role="grid">
        <Column recipes={left} testId="left-column" />
        <Column
          loadMorePixelId={
            !isFetchingNextPage ? data?.pages.length.toString() : undefined
          }
          loadMorePixelRef={endOfGridRef}
          recipes={right}
          testId="right-column"
        />
      </Grid>
      {isFetchingNextPage && hasNextPage ? (
        <Loading stroke={theme.colors.primaryYellow.value} strokeWidth={5} />
      ) : (
        <Loading as="div" />
      )}
    </Constrained>
  );
};
