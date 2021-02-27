import React, { useContext, useMemo } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useWindowSize } from "@react-hook/window-size";
import { useTransition } from "react-spring";

import { MasonryCard } from "./masonryCard";
import { NoSearchResults } from "./noSearchResults";

const style = {
  masonry: ({ theme, height }) => ({
    position: "relative",
    height: `${height}px`,
    ...theme.contentWithBottomBar,
    margin: `0 ${theme.constrainedMargin}px`,
  }),
  cardWrapper: () => ({
    position: "absolute",
  }),
  card: () => ({
    margin: 0,
  }),
};

export const SearchResults = ({ query, recipes, searching }) => {
  const [windowWidth] = useWindowSize();
  const theme = useContext(ThemeContext);

  const numberOfColumns = 2;
  const [heights, gridItems] = useMemo(() => {
    const heights = [0, 0];
    const gridItems = recipes.map((recipe) => {
      const column = heights.indexOf(Math.min(...heights));
      const widthOfColumn =
        (windowWidth - 2 * theme.constrainedMargin - theme.homepageCardMargin) /
        numberOfColumns;
      const xy = [
        widthOfColumn * column + (column === 1 ? theme.homepageCardMargin : 0),
        heights[column] === 0
          ? heights[column]
          : heights[column] + theme.homepageCardMargin,
      ];

      const { mediumImageHeight, mediumImageWidth } = recipe;
      const heightOfRecipe =
        widthOfColumn * (mediumImageHeight / mediumImageWidth);
      heights[column] +=
        heightOfRecipe + (heights[column] > 0 ? theme.homepageCardMargin : 0);

      return {
        ...recipe,
        mediumImage: recipe.mediumImage,
        xy,
        width: widthOfColumn,
        height: heightOfRecipe,
      };
    });

    return [heights, gridItems];
  }, [recipes, windowWidth]);

  const masonryAnimations = useTransition(gridItems, (item) => item.slug, {
    from: ({ xy, width, height }) => ({
      xy,
      width,
      height,
      opacity: 0,
    }),
    enter: ({ xy, width, height }) => ({
      xy,
      width,
      height,
      opacity: 1,
    }),
    update: ({ xy, width, height }) => ({
      xy,
      width,
      height,
    }),
    leave: { height: 0, opacity: 0 },
    trail: 0,
  });

  return recipes.length ? (
    <FelaComponent style={style.masonry} height={Math.max(...heights)}>
      {masonryAnimations.map(({ item, props: { xy, ...rest }, key }) => (
        <MasonryCard
          key={key}
          index={key}
          data={item}
          width={item.width}
          removeMargin={false}
          autoLoadSmall={true}
          innerStyle={style.card}
          style={style.cardWrapper}
          stateKey={"searchLazyLoadedImages"}
          animation={{
            transform: xy.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
            ...rest,
          }}
        />
      ))}
    </FelaComponent>
  ) : query && !searching ? (
    <NoSearchResults />
  ) : null;
};
