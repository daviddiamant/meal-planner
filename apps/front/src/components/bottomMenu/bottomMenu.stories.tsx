import { Meta, Story } from "@storybook/react";

import { BottomMenu, BottomMenuProps } from ".";

export default {
  component: BottomMenu,
  title: "Components/BottomMenu",
} as Meta;

const Template: Story<BottomMenuProps> = (args) => <BottomMenu {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "A component for bottom navigation",
};
