import { createServer } from "../../common/routing";
import { initNodeSentry } from "../../common/sentry";
import { weekController } from "./controller";

initNodeSentry();

export const weekAPI = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const res = await server(event, context);

  return res;
};

const server = createServer(weekController("/api/week"));
