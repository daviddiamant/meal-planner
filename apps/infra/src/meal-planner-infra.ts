import "source-map-support/register";

import * as cdk from "@aws-cdk/core";

import * as envStockholm from "./env.json";
import { FrontendStack } from "./stacks/frontend";

const mealPlanner = new cdk.App();

new FrontendStack(mealPlanner, "MealPlannerTypescriptFrontend", {
  env: envStockholm,
});
