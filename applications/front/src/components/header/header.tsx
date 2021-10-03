import { ReactNode } from "react";

import { styled } from "../../stitches.config";

export type HeaderProps = {
  children: ReactNode;
};

export const Header = styled("div", {
  minHeight: "$headerHeight",
  overflow: "hidden",
});
