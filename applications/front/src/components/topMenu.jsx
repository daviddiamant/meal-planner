import React from "react";
import { FelaComponent } from "react-fela";

const style = {
  menu: ({ theme, shouldHaveBorder }) => ({
    position: "fixed",
    top: 0,
    width: "100%",
    height: `${theme.navigationHeight}px`,
    overflow: "hidden",
    zIndex: 999,
    borderBottom: shouldHaveBorder
      ? `1px solid ${theme.quaternaryColors.grey}`
      : "none",
  }),
};

export const TopMenu = ({ children, removeBorder }) => (
  <FelaComponent style={style.menu} shouldHaveBorder={!removeBorder}>
    {children}
  </FelaComponent>
);
