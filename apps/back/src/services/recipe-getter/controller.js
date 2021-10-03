import Router from "@koa/router";

import { authMiddleware } from "../../common/routing";
import { getBook } from "./DAL";
import { getRecipe } from "./service";

export const recipeGetterController = (prefix) => {
  const router = new Router({ prefix });

  router.get(["/", "/:from/:to"], authMiddleware, async (ctx) => {
    const from = parseInt(ctx.params.from, 10);
    const to = parseInt(ctx.params.to, 10);

    if (to < from) {
      ctx.response.status = 400;
      ctx.body = { result: "From needs to be smaller than to" };
      return;
    }

    const recipes = await getBook(ctx.bookID, from, to);

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
