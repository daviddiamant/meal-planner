import { Paths, Responses } from "../types";
import { server, successfulHandler } from ".";

export const getRecipeMock = (aspectRatio = 1, slug = "some-slug") => ({
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
  pagination = [0, 100],
  recipes?: Responses["Recipes"]
) =>
  successfulHandler<Responses["Recipes"]>(
    "get",
    Paths.Recipes.replace(":from", pagination[0].toString()).replace(
      ":to",
      pagination[1].toString()
    ),
    false,
    recipes ?? Array(pagination[1] - pagination[0]).fill(getRecipeMock())
  );

export const setupRecipesHandler = (
  pagination = [0, 100],
  recipes?: Responses["Recipes"]
) => server.use(getRecipesHandler(pagination, recipes));
