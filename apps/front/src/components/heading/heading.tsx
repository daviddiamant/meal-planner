import { ReactNode } from "react";

import { styled } from "../../stitches.config";

type HeadingTags = "h1" | "h2" | "h3";
export type HeadingProps = {
  as?: HeadingTags;
  children: ReactNode;
};

export const Heading = styled("h1", {
  margin: 0,
  padding: 0,
  fontFamily: "$heading",
  fontWeight: "$3",
  lineHeight: "$1",
  letterSpacing: "$2",
  variants: {
    as: {
      h1: {
        fontSize: "8vw",
      },
      h2: {
        fontSize: "6.5vw",
      },
      h3: {
        fontSize: "5vw",
      },
    },
  },
  defaultVariants: {
    as: "h1",
  },
});
