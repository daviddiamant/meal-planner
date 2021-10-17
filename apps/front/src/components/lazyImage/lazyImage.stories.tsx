import { Meta, Story } from "@storybook/react";

import { LazyImage, LazyImageProps } from "./";

export default {
  component: LazyImage,
  title: "Components/LazyImage",
} as Meta;

const Template: Story<LazyImageProps> = (args) => <LazyImage {...args} />;

export const primary = Template.bind({});
primary.args = {
  smallUrl:
    "/recipe-images/farslimpa-med-graddsas-lingon-och-gronkal/image-small.jpeg",
  largeUrl:
    "/recipe-images/farslimpa-med-graddsas-lingon-och-gronkal/image.jpeg",
  alt: "Some alt",
  storybook: true,
};
