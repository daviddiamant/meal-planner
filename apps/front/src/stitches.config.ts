import type * as Stitches from "@stitches/react";
import { createStitches } from "@stitches/react";

import { baseTheme, lightTheme } from "./themes";

const utils = {
  getNumericFromString: (value: string) => parseFloat(value.replace(/\D/g, "")),
};

const {
  config,
  css,
  globalCss: stitchesGlobal,
  styled,
  theme,
} = createStitches({
  theme: { ...baseTheme, ...lightTheme },
});

const htmlBody = { height: "100%", margin: 0, padding: 0 };
const globalStyling = stitchesGlobal({
  html: htmlBody,
  body: {
    ...htmlBody,
    fontFamily: "$bread",
    fontWeight: "$1",
    fontSize: "4.3vw",
    lineHeight: "1.6",
    letterSpacing: "0.5px",
    color: "$primaryText",
    "&.sb-main-padded.sb-show-main": htmlBody,
  },
  "#root": htmlBody,
  "*": { boxSizing: "border-box" },
  "*::before": { boxSizing: "border-box" },
  "*::after": { boxSizing: "border-box" },
});

const autoCallingCss = (styleObject: CSS) => css(styleObject)();

export type Theme = typeof theme;
export type CSS = Stitches.CSS<typeof config>;
export { autoCallingCss as css, globalStyling, styled, theme, utils };