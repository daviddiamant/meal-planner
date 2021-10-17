import React from "react";
import { globalStyling } from "../src/stitches.config";
import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";
import { QueryClient, QueryClientProvider } from "react-query";
import { initialize as initializeMsw, mswDecorator } from "msw-storybook-addon";

const queryClient = new QueryClient();
initializeMsw();

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: INITIAL_VIEWPORTS,
    defaultViewport: "iphone5",
  }
};

export const decorators = [
  mswDecorator,
  (Story) => {
    globalStyling();

    return (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    );
  },
]
