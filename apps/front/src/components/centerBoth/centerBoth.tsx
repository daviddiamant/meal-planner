import { ReactNode } from "react";

import { styled } from "../../stitches.config";

export type CenterBothProps = {
  children: ReactNode;
};

export const CenterBoth = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
});
