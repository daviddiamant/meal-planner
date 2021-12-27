import { Paths, Responses } from "@meal-planner/types";

import { server, successfulHandler } from ".";

export const getRecipeMock = (
  aspectRatio = 1,
  slug = "some-slug"
): Responses["Recipes"]["recipes"][number] => ({
  mediumImage: "",
  mediumImageHeight: 200,
  mediumImageWidth: 200 * aspectRatio,
  slug,
  smallImage: "",
  smallImageHeight: 100,
  smallImageWidth: 100 * aspectRatio,
  title: "Some Recipe",
  url: "",
});

export const getRecipesHandler = (
  pagination = [0, 64],
  recipes?: Responses["Recipes"]["recipes"]
) =>
  successfulHandler<Responses["Recipes"]>(
    "get",
    Paths.Recipes.replace(":from", pagination[0].toString()).replace(
      ":to",
      pagination[1].toString()
    ),
    false,
    {
      recipes:
        recipes ?? Array(pagination[1] - pagination[0]).fill(getRecipeMock()),
      hasMoreRecipes: true,
    }
  );

export const setupRecipesHandler = (
  pagination = [0, 64],
  recipes?: Responses["Recipes"]["recipes"]
): void => server.use(getRecipesHandler(pagination, recipes));
