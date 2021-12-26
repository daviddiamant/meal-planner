import Router from "@koa/router";

import { authMiddleware } from "../../common/routing";
import { getJSONFromContext, validURL } from "../../common/utils";
import { addRecipe } from "./service";

export const recipeSetterController = (prefix) => {
  const router = new Router({ prefix });

  router.post("/add", authMiddleware, async (ctx) => {
    const url = getJSONFromContext(ctx).value || "";

    if (!url || !validURL(url)) {
      ctx.response.status = 400;
      ctx.body = { result: "Faulty URL!" };
      return;
    }

    const added = await addRecipe(ctx.bookID, url);

    if (!added) {
      ctx.response.status = 400;
      ctx.body = { result: "Could not add recipe" };
      return;
    }

    ctx.body = { result: added };
  });

  return router;
};
