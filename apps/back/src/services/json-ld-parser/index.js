import { AWSLambda } from "@sentry/serverless";

import { initLambdaSentry } from "../../common/sentry";
import { parseJsonLD } from "./service";

initLambdaSentry();

export const jsonLDParser = AWSLambda.wrapHandler(async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.Records.length) {
    for (const record of event.Records) {
      if (!record.body.length) {
        continue;
      }

      await parseJsonLD(record.body);
    }
  }
});
