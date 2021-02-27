import React from "react";
import { FelaComponent } from "react-fela";

const style = {
  addInputWrapper: ({ theme }) => ({
    boxSizing: "border-box",
    position: "relative",
    display: "flex",
    width: "100%",
    height: "42px",
    alignItems: "center",
    justifyContent: "space-between",
    padding: `0 ${theme.primary.borderRadius - 3}px`,
    textTransform: "lowercase",
    color: theme.textColors.primary,
    background: theme.quaternaryColors.grey,
    borderRadius: `${theme.primary.borderRadius}px`,
    border: `1px solid ${theme.quaternaryColors.grey}`,
    ":focus-within": {
      borderColor: theme.secondaryColors.yellow,
    },
  }),
  addInput: ({ theme, clear }) => ({
    width: clear ? "80%" : "100%",
    height: "100%",
    border: "none",
    borderRadius: 0,
    outline: "none",
    background: "none",
    "-webkit-border-radius": 0,
    "-webkit-appearance": "none",
    "-webkit-box-shadow": "none",
    boxShadow: "none",
    lineHeight: "100%",
    fontSize: "4.5vw",
    "::placeholder": {
      color: theme.textColors.secondary,
      textTransform: "none",
    },
    ":focus": {
      shadow: "none",
      outline: "none",
      "-webkit-touch-callout": "initial",
      "-webkit-user-select": "initial",
      "-khtml-user-select": "initial",
      "-moz-user-select": "initial",
      "-ms-user-select": "initial",
      "user-select": "initial",
    },
  }),
  clearSearch: ({ theme }) => ({
    opacity: 0.75,
    fontSize: "4vw",
    textTransform: "uppercase",
    color: theme.textColors.secondary,
  }),
};

export const Input = ({
  value,
  onClear,
  innerRef,
  style: externalStyle,
  disabled = false,
  showClear = false,
  ...props
}) => (
  <FelaComponent style={[style.addInputWrapper, externalStyle]}>
    <FelaComponent style={style.addInput}>
      {({ className }) => (
        <input
          {...props}
          type="text"
          value={value}
          ref={innerRef}
          disabled={disabled}
          className={className}
        />
      )}
    </FelaComponent>
    {showClear && value ? (
      <FelaComponent style={style.clearSearch}>
        {({ className }) => (
          <span className={className} onClick={onClear}>
            Rensa
          </span>
        )}
      </FelaComponent>
    ) : null}
  </FelaComponent>
);
