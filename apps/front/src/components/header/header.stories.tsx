import { Meta, Story } from "@storybook/react";

import { Header, HeaderProps } from ".";

export default {
  component: Header,
  title: "Components/Header",
} as Meta;

const Template: Story<HeaderProps> = (args) => <Header {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "Some header",
};
