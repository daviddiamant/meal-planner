import { Meta, Story } from "@storybook/react";

import { ExpandText, ExpandTextProps } from ".";

export default {
  component: ExpandText,
  title: "Components/ExpandText",
} as Meta;

const Template: Story<ExpandTextProps> = (args) => <ExpandText {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children:
    "Component that will, given a long text and a number of decired rows, only show that number of rows even though the long text needs more rows to display fully. A link to show the whole text will be displayed. Clicking that link will show all the rows that are required to display the long text.",
  numLines: 2,
  toggleColor: "inherit",
};
