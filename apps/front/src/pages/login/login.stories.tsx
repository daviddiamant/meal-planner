import { Meta } from "@storybook/react";

import { Login } from "./";

export default {
  component: Login,
  title: "Pages/Login",
} as Meta;

export const Primary = (): JSX.Element => <Login />;
