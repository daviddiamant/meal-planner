import { Meta } from "@storybook/react";

import { Recipe } from "./";

export default {
  component: Recipe,
  title: "Pages/Recipe",
} as Meta;

export const Primary = (): JSX.Element => <Recipe />;
