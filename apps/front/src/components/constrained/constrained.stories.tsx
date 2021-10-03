import { Meta, Story } from "@storybook/react";

import { Constrained, ConstrainedProps } from ".";

export default {
  component: Constrained,
  title: "Components/Constrained",
} as Meta;

const Template: Story<ConstrainedProps> = (args) => <Constrained {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "Some content that should be horisontally constrained.",
};
