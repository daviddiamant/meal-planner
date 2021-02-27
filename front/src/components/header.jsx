import React from "react";
import { FelaComponent } from "react-fela";

const style = {
  content: ({ theme }) => ({
    boxSizing: "border-box",
    minHeight: theme.headerHeight,
    overflow: "hidden",
  }),
};

export const Header = ({
  children,
  externalRef,
  style: externalStyle,
  ...props
}) => (
  <FelaComponent style={[style.content, externalStyle]}>
    {({ className }) => (
      <div className={className} ref={externalRef} {...props}>
        {children}
      </div>
    )}
  </FelaComponent>
);
