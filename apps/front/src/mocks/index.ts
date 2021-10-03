import { rest } from "msw";
import { setupServer, SetupServerApi } from "msw/node";

import { setupConfigHandler, setupRecipesHandler } from ".";
export * from "./recipes";
export * from "./user";

// Can only create a server in a node process
export const server = (typeof global.process !== "undefined" &&
  setupServer()) as SetupServerApi;

export const setupBaseHandlers = () => {
  setupConfigHandler();
  setupRecipesHandler();
};

export const successfulHandler = <ReturnType, RequestType = any>(
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
