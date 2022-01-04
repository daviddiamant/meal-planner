import { Meta } from "@storybook/react";

import { Profile } from "./";

export default {
  component: Profile,
  title: "Pages/Profile",
} as Meta;

export const Primary = (): JSX.Element => <Profile />;
