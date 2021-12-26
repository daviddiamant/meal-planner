import Router from "@koa/router";

import { authMiddleware } from "../../common/routing";
import { getBook } from "./DAL";
import { getBookPaginated, getRecipe } from "./service";

export const recipeGetterController = (prefix) => {
  const router = new Router({ prefix });

  router.get(["/"], authMiddleware, async (ctx) => {
    const recipes = await getBook(ctx.bookID);

    ctx.body = recipes;
  });

  router.get(["/:from/:to"], authMiddleware, async (ctx) => {
    const from = parseInt(ctx.params.from ?? 0, 10);
    const to = parseInt(ctx.params.to ?? Number.MAX_SAFE_INTEGER, 10);

    if (to < from) {
      ctx.response.status = 400;
      ctx.body = { result: "From needs to be smaller than to" };
      return;
    }

    const page = await getBookPaginated(ctx.bookID, from, to);

    ctx.body = page;
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
