import { RefObject } from "react";

import { styled } from "../../../stitches.config";
import { Recipe as TRecipe } from "../../../types";
import { Recipe } from ".";

const Styled = styled("div", {
  width: "50%",
  "&:first-child": {
    marginRight: "$2",
  },
});

export const Column = ({
  loadMorePixelId,
  loadMorePixelRef,
  recipes,
  testId,
}: {
  loadMorePixelId?: string;
  loadMorePixelRef?: RefObject<HTMLDivElement>;
  recipes: TRecipe[];
  testId?: string;
}) => (
  <Styled data-testid={testId}>
    {recipes.map((recipe, i) => (
      <Recipe recipe={recipe} key={i}></Recipe>
    ))}

    {!!loadMorePixelId && (
      <div id={loadMorePixelId} key={loadMorePixelId} ref={loadMorePixelRef} />
    )}
  </Styled>
);
