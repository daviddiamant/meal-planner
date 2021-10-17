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
      <Recipe key={i} recipe={recipe}></Recipe>
    ))}

    {!!loadMorePixelId && (
      <div key={loadMorePixelId} ref={loadMorePixelRef} id={loadMorePixelId} />
    )}
  </Styled>
);
