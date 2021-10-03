import { Meta, Story } from "@storybook/react";

import { CenterBoth, CenterBothProps } from ".";

export default {
  component: CenterBoth,
  title: "Components/CenterBoth",
} as Meta;

const Template: Story<CenterBothProps> = (args) => <CenterBoth {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children:
    "Some content that should be centered both horisontally and vertically.",
};
