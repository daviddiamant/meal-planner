import { Meta } from "@storybook/react";

import { Search } from "./";

export default {
  component: Search,
  title: "Pages/Search",
} as Meta;

export const Primary = (): JSX.Element => <Search />;
