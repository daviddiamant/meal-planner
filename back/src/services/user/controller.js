import Router from "@koa/router";

import { authMiddleware } from "../../common/routing";
import { getUserPublicFields } from "./DAL";

export const weekController = (prefix) => {
  const router = new Router({ prefix });

  router.get("/", authMiddleware, async (ctx) => {
    const user = await getUserPublicFields(ctx.uid);

    ctx.body = user;
  });

  return router;
};
