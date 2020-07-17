const constrainedMargin = 20;
const navigationHeight = 65;
const navigationPaddingBottom = 15; // needed for ios swipe "pad"
const homepageCardMargin = 10;

const baseTheme = {
  primaryFont: '"Roboto", sans-serif',
  primaryFontWeight: 300,
  primaryFontSize: "4.3vw",
  primaryLineHeight: "1.6",
  primaryLetterSpacing: "0.5px",
  headerFont: '"Poppins", sans-serif',
  headerFontWeight: 600,
  headerLineHeight: "115%",
  headerLetterSpacing: "1px",
  h1FontSize: "8vw",
  h2FontSize: "6.5vw",
  h3FontSize: "5vw",
  helpers: {
    hexToRgba: ({ key, hex, a = 1 }) => {
      var bigint = parseInt(hex.replace("#", ""), 16);
      var r = (bigint >> 16) & 255;
      var g = (bigint >> 8) & 255;
      var b = bigint & 255;

      let rgb = {};
      rgb[key] = `rgba(${r}, ${g}, ${b}, ${a})`;

      return rgb;
    },
    noHighlight: {
      "-webkit-touch-callout": "none",
      "-webkit-user-select": "none",
      "-khtml-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      "user-select": "none",
      "-webkit-tap-highlight-color": "transparent",
    },
    flexCenterBoth: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    fzSmall: "3.7vw",
    tar: {
      textAlign: "right",
    },
    tal: {
      textAlign: "left",
    },
    tac: {
      textAlign: "center",
    },
    resetHeaders: {
      lineHeight: "1",
      margin: 0,
      padding: 0,
    },
  },
  constrainedMargin,
  contentWithBottomBar: {
    marginBottom: `${navigationHeight + navigationPaddingBottom + 25}px`,
  },
  constrained: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "1250px",
    margin: "auto",
    padding: `0 ${constrainedMargin}px 0 ${constrainedMargin}px`,
  },
  primary: {
    borderRadius: 18,
  },
  homepageCardMargin,
  sliderCardMargin: 10,
  navigationHeight,
  navigationPaddingBottom,
  dropdownPadding: 5,
};

export default baseTheme;
