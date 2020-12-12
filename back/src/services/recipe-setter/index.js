import { createServer } from "../../common/routing";
import { initNodeSentry } from "../../common/sentry";
import { recipeSetterController } from "./controller";

initNodeSentry();

export const recipeSetterAPI = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  const res = await server(event, context);

  return res;
};

const server = createServer(recipeSetterController("/api/recipes"));
