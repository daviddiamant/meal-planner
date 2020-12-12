import * as SentryNode from "@sentry/node";
import * as SentryLambda from "@sentry/serverless";
import * as SentryTracing from "@sentry/tracing";

const initParams = {
  environment: process.env.LOCAL ? "local" : "production",
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.LOCAL ? 1 : 0.25,
};

export const initLambdaSentry = () => {
  if (!process.env.SENTRY_LAMBDA_REGISTRED) {
    SentryLambda.AWSLambda.init({ initParams });

    SentryTracing.addExtensionMethods();

    process.env.SENTRY_LAMBDA_REGISTRED = 1;
  }
};

export const initNodeSentry = () => {
  if (!process.env.SENTRY_NODE_REGISTRED) {
    SentryNode.init(initParams);

    SentryTracing.addExtensionMethods();

    process.env.SENTRY_NODE_REGISTRED = 1;
  }
};

export const errorHandler = (err, ctx) => {
  SentryNode.withScope((scope) => {
    scope.setUser({
      id: ctx?.uid || null,
    });
    scope.addEventProcessor((event) =>
      SentryNode.Handlers.parseRequest(event, ctx.request)
    );
    SentryNode.captureException(err);
  });
};

export const tracingMiddleWare = async (ctx, next) => {
  const reqMethod = (ctx.method || "").toUpperCase();
  const reqUrl = ctx.url && SentryTracing.stripUrlQueryAndFragment(ctx.url);

  let traceparentData;
  if (ctx.request.get("sentry-trace")) {
    traceparentData = SentryTracing.extractTraceparentData(
      ctx.request.get("sentry-trace")
    );
  }

  const transaction = SentryNode.startTransaction({
    name: `${reqMethod} ${reqUrl}`,
    op: "http.server",
    ...traceparentData,
  });

  ctx.__sentry_transaction = transaction;

  await next();

  if (ctx._matchedRoute) {
    const mountPath = ctx.mountPath || "";
    transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`);
  }
  transaction.setHttpStatus(ctx.status);
  transaction.finish();
};
