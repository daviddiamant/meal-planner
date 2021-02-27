import Router from "@koa/router";

import { authMiddleware } from "../../common/routing";
import { getBook } from "./DAL";
import { getRecipe } from "./service";

export const recipeGetterController = (prefix) => {
  const router = new Router({ prefix });

  router.get("/", authMiddleware, async (ctx) => {
    const recipes = await getBook(ctx.bookID);

    ctx.body = recipes;
  });

  router.get("/:slug", authMiddleware, async (ctx) => {
    const recipe = await getRecipe(ctx.bookID, ctx.params.slug);

    if (!recipe) {
      ctx.response.status = 404;
      ctx.body = { result: "No such recipe" };
      return;
    }

    ctx.body = recipe;
  });

  return router;
};
