import type * as Stitches from "@stitches/react";
import { createStitches } from "@stitches/react";

import { baseTheme, lightTheme } from "./themes";

const utils = {
  getNumericFromString: (value: string): number =>
    parseFloat(value.replace(/\D/g, "")),
  hexToRgba: (
    hex: string,
    a = 1
  ): `rgba(${number}, ${number}, ${number}, ${number})` => {
    const bigint = parseInt(hex.replace("#", ""), 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  },
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
    fontSize: "$1",
    lineHeight: "$primary",
    letterSpacing: "0.5px",
    background: "$background",
    color: "$primaryText",
    "&.sb-main-padded.sb-show-main": htmlBody,
  },
  "#root": htmlBody,
  "*": { boxSizing: "border-box" },
  "*::before": { boxSizing: "border-box" },
  "*::after": { boxSizing: "border-box" },
});

const autoCallingCss = (
  styleObject: CSS
): string & {
  className: string;
  selector: string;
  props: Record<string, unknown>;
} => css(styleObject)();

export type Theme = typeof theme;
export type CSS = Stitches.CSS<typeof config>;
export type Style = Record<string, CSS>;
export type StyledComponent<
  TOwnProps,
  TReturnComponent extends { [key: string]: any; [key: symbol]: any }
> = TOwnProps &
  Stitches.VariantProps<TReturnComponent> &
  Partial<{ className: string }>;
export { autoCallingCss as css, globalStyling, styled, theme, utils };
