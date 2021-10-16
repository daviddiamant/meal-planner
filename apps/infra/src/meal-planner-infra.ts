import "source-map-support/register";

import * as cdk from "@aws-cdk/core";

import { FrontendStack } from "./stacks/frontend";

const mealPlanner = new cdk.App();
const envStockholm = { account: "831251179301", region: "eu-north-1" };

new FrontendStack(mealPlanner, "MealPlannerTypescriptFrontend", {
  env: envStockholm,
});
