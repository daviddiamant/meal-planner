import React from "react";
import { FelaComponent } from "react-fela";

const style = {
  content: {
    boxSizing: "border-box",
    minHeight: "180px",
    overflow: "hidden",
  },
};

export const Header = ({ children }) => (
  <FelaComponent style={style.content}>{children}</FelaComponent>
);
