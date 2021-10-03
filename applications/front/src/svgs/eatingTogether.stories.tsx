import { Meta, Story } from "@storybook/react";

import { css, theme } from "../stitches.config";
import { EatingTogether, EatingTogetherProps } from ".";

export default {
  component: EatingTogether,
  title: "Svgs/EatingTogheter",
} as Meta;

const style = { width: "100%" };
const Template: Story<EatingTogetherProps> = (args) => (
  <EatingTogether {...args} />
);

export const Primary = Template.bind({});
Primary.args = { className: css(style), theme };
