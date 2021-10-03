import { Meta, Story } from "@storybook/react";

import { Btn, BtnProps } from ".";

export default {
  component: Btn,
  title: "Components/Btn",
} as Meta;

const Template: Story<BtnProps> = (args) => <Btn {...args} />;

export const Enabled = Template.bind({});
Enabled.args = {
  children: "Some Btn",
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: "Some Btn",
  disabled: true,
};
