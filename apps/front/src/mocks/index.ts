/* eslint-disable @typescript-eslint/no-var-requires */
import { rest } from "msw";
import { SetupServerApi } from "msw/node";

import { setupRecipesHandler } from "./recipes";
import { setupConfigHandler } from "./user";

export * from "./recipes";
export * from "./user";

// Only create the server when run in Jest
export const server = (
  process?.env?.NODE_ENV === "test" ? require("msw/node").setupServer() : {}
) as SetupServerApi;

export const setupBaseHandlers = (): void => {
  setupConfigHandler();
  setupRecipesHandler();
};

export const successfulHandler = <
  ReturnType extends Record<string, any>,
  RequestType extends Record<string, any> = any
>(
  method: "get" | "post",
  path: string,
  delay: boolean,
  response: ReturnType
) =>
  rest[method]<RequestType, ReturnType>(`*${path}`, (_, res, ctx) =>
    res(
      ctx.delay(delay ? Math.floor(Math.random() * (250 - 100 + 1)) + 100 : 0),
      ctx.status(200),
      ctx.json(response)
    )
  );
