import React from "react";
import { render } from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

import MainController from "./controllers/mainController";
import { SENTRY_DSN } from "./appConfig";

Sentry.init({
  dsn: SENTRY_DSN,
  normalizeDepth: 10,
  environment:
    process?.env?.NODE_ENV === "development" ? "local" : "production",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: process?.env?.NODE_ENV === "development" ? 1.0 : 0.25,
});

render(<MainController />, document.querySelector("#main"));
