import { AWSLambda } from "@sentry/serverless";

import { initLambdaSentry } from "../../common/sentry";
import { processImage } from "./service";

initLambdaSentry();

export const imageSaver = AWSLambda.wrapHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.Records.length) {
    for (const record of event.Records) {
      if (!record.body.length) {
        continue;
      }

      await processImage(record.body);
    }
  }
});
