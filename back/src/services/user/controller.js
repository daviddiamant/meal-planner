import Router from "@koa/router";

import { authMiddleware } from "../../common/routing";
import { getUser } from "./service";

export const weekController = (prefix) => {
  const router = new Router({ prefix });

  router.get("/", authMiddleware, async (ctx) => {
    const user = await getUser(ctx.uid);

    ctx.body = user;
  });

  return router;
};
