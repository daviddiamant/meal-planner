import { ReactNode } from "react";

import { styled } from "../../stitches.config";

export type ConstrainedProps = {
  children: ReactNode;
};

export const Constrained = styled("div", {
  display: "flex",
  width: "100%",
  maxWidth: "1250px",
  margin: "auto",
  padding: "0 $4",
});
