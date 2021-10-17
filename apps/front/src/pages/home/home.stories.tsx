import { Meta } from "@storybook/react";

import { getConfigHandler, getRecipesHandler } from "../../mocks";
import { Home } from "./";

export default {
  component: Home,
  title: "Pages/Home",
} as Meta;

export const Primary = () => <Home />;
Primary.parameters = {
  msw: [
    getConfigHandler(),
    getRecipesHandler(),
    getRecipesHandler([64, 128], []),
  ],
};
