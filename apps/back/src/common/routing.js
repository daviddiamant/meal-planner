import cors from "@koa/cors";
import Koa from "koa";
import serverless from "serverless-http";

import { errorHandler, tracingMiddleWare } from "./sentry";

let app;

export const createServer = (controller) => {
  if (app) {
    return app;
  }
  app = new Koa();

  app.use(cors());
  app.use(tracingMiddleWare);
  app.on("error", errorHandler);
  app.use(controller.routes()).use(controller.allowedMethods());

  return serverless(app);
};

export const authMiddleware = (ctx, next) => {
  const requiredFieldsFromAuth = ["uid", "weekID", "bookID"];
  if (
    !requiredFieldsFromAuth.every(
      (field) => !!ctx.req?.requestContext?.authorizer?.[field]
    )
  ) {
    ctx.response.status = 400;
    ctx.body = { result: "Did not get user from auth" };
    return;
  }

  for (const field of requiredFieldsFromAuth) {
    ctx[field] = ctx.req.requestContext.authorizer[field];
  }

  return next();
};
