const constrainedMargin = 25;
const navigationHeight = 65;
const navigationPaddingBottom = 15; // needed for ios swipe "pad"

const baseTheme = {
  primaryFont: '"Roboto", sans-serif',
  primaryFontWeight: 300,
  primaryFontSize: "16px",
  primaryLineHeight: "1.6",
  primaryLetterSpacing: "0.5px",
  headerFont: '"Poppins", sans-serif',
  headerFontWeight: 600,
  headerLineHeight: "115%",
  headerLetterSpacing: "1px",
  helpers: {
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
    fzSmall: "14px",
    tar: {
      textAlign: "right",
    },
    tal: {
      textAlign: "left",
    },
    tac: {
      textAlign: "center",
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
  homepageCardMargin: 10,
  navigationHeight,
  navigationPaddingBottom,
};

export default baseTheme;
