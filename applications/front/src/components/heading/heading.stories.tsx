import { Meta, Story } from "@storybook/react";

import { Heading, HeadingProps } from "./";

export default {
  component: Heading,
  title: "Components/Heading",
} as Meta;

const Template: Story<HeadingProps> = (args) => <Heading {...args} />;

export const h1 = Template.bind({});
h1.args = {
  children: "Some H1",
};

export const h2 = Template.bind({});
h2.args = {
  children: "Some H2",
  as: "h2",
};

export const h3 = Template.bind({});
h3.args = {
  children: "Some H3",
  as: "h3",
};
