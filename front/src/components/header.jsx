import React from "react";
import { FelaComponent } from "react-fela";

const style = {
  content: {
    boxSizing: "border-box",
    minHeight: "180px",
    overflow: "hidden",
  },
};

export const Header = ({ children, externalRef, ...props }) => (
  <FelaComponent style={style.content}>
    {({ className }) => (
      <div className={className} ref={externalRef} {...props}>
        {children}
      </div>
    )}
  </FelaComponent>
);
