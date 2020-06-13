import React from "react";
import { FelaComponent } from "react-fela";

const style = {
  menu: ({ theme }) => ({
    position: "fixed",
    bottom: "-2px",
    width: "100%",
    height: `${theme.navigationHeight}px`,
    paddingBottom: `${theme.navigationPaddingBottom}px`,
    background: theme.background,
    overflow: "hidden",
    borderTop: `1px solid ${theme.quaternaryColors.grey}`,
  }),
};

export const BottomMenu = ({ children }) => (
  <FelaComponent style={style.menu}>{children}</FelaComponent>
);
