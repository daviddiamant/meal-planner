import React, { useContext } from "react";
import { FelaRenderer, ThemeContext } from "react-fela";

const styles = [
  {
    selector: "body, html",
    rules: ({ theme }) => ({
      height: "100%",
      margin: 0,
      fontFamily: theme.primaryFont,
      fontWeight: theme.primaryFontWeight,
      fontSize: theme.primaryFontSize,
      lineHeight: theme.primaryLineHeight,
      letterSpacing: theme.primaryLetterSpacing,
      color: theme.textColors.primary,
    }),
  },
  {
    selector: "#main",
    rules: () => ({
      height: "100%",
    }),
  },
  {
    selector: "h1, h2, h3, h4, h5, h6, h7, h8",
    rules: ({ theme }) => ({
      fontFamily: theme.headerFont,
      fontWeight: theme.headerFontWeight,
      lineHeight: theme.headerLineHeight,
      letterSpacing: theme.headerLetterSpacing,
    }),
  },
  {
    selector: "a",
    rules: () => ({
      color: "inherit",
      textDecoration: "none",
    }),
  },
];

const BaseStyle = () => {
  const theme = useContext(ThemeContext);
  return (
    <FelaRenderer>
      {(renderer) =>
        styles.map((style) =>
          renderer.renderStatic(style.rules({ theme }), style.selector)
        )
      }
    </FelaRenderer>
  );
};

export default BaseStyle;
