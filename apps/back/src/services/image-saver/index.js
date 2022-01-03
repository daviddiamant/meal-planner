import { AWSLambda } from "@sentry/serverless";

import { initLambdaSentry } from "../../common/sentry";
import { validURL } from "../../common/utils";
import { processImage } from "./service";

initLambdaSentry();

export const imageSaver = AWSLambda.wrapHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.Records.length) {
    for (const record of event.Records) {
      if (!record.body.length) {
        continue;
      }

      const { recipeId, imageUrl, slug } = JSON.parse(record.body);

      if (!recipeId || !imageUrl || !slug) {
        throw new Error("Missing data");
      }

      const urlWithProtocol = imageUrl.includes("http")
        ? imageUrl
        : imageUrl.indexOf("//") === 0
        ? "https:" + imageUrl
        : "";

      if (!urlWithProtocol || !validURL(urlWithProtocol)) {
        throw new Error("Faulty url!");
      }

      await processImage(recipeId, urlWithProtocol, slug);
    }
  }
});
