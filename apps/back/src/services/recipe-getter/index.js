import { createServer } from "../../common/routing";
import { initNodeSentry } from "../../common/sentry";
import { recipeGetterController } from "./controller";

initNodeSentry();

export const recipeGetterAPI = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const res = await server(event, context);

  return res;
};

const server = createServer(recipeGetterController("/api/recipes"));
