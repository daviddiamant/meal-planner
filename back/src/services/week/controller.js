import Router from "@koa/router";

import { authMiddleware } from "../../common/routing";
import { getJSONFromContext } from "../../common/utils";
import { getWeek } from "./DAL";
import { addToWeek, removeFromWeek } from "./service";

export const weekController = (prefix) => {
  const router = new Router({ prefix });

  router.get("/", authMiddleware, async (ctx) => {
    const recipes = await getWeek(ctx.weekID);

    ctx.body = recipes;
  });

  router.post("/add", authMiddleware, async (ctx) => {
    const slug = getJSONFromContext(ctx).value || "";
    if (!slug) {
      ctx.response.status = 400;
      ctx.body = { result: "Not enough info to add!" };
      return;
    }

    const added = await addToWeek(ctx.weekID, ctx.bookID, slug);
    if (!added) {
      ctx.response.status = 400;
      ctx.body = { result: "Could not plan recipe:(" };
      return;
    }

    ctx.body = { result: true };
  });

  router.post("/remove", authMiddleware, async (ctx) => {
    const slug = getJSONFromContext(ctx).value || "";
    if (!slug) {
      ctx.response.status = 400;
      ctx.body = { result: "Not enough info to remove!" };
      return;
    }

    const removed = await removeFromWeek(ctx.weekID, slug);
    if (!removed) {
      ctx.response.status = 400;
      ctx.body = { result: "Could not remove recipe:(" };
      return;
    }

    ctx.body = { result: true };
  });

  return router;
};
