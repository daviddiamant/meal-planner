import { ReactNode } from "react";

import { Style, styled } from "../../stitches.config";
import { CenterBoth } from "../centerBoth";

export type BtnProps = {
  disabled?: boolean;
  children: ReactNode;
  onClick?: () => void;
};

const Outer = styled("div", {
  display: "flex",
  minHeight: "50px",
  padding: "0 35px 0 35px",
  textAlign: "center",
  whiteSpace: "nowrap",
  fontSize: "$4",
  fontWeight: "$2",
  fontFamily: "$heading",
  background: "$primaryYellow",
  color: "$darkButton",
  borderRadius: "$primary",
  variants: {
    disabled: {
      true: {
        opacity: 0.75,
      },
      false: {
        opacity: 1,
      },
    },
  },
});
const style: Style = { inner: { flex: 1 } };

export const Btn = ({ children, disabled = false, onClick }: BtnProps) => (
  <Outer
    disabled={disabled}
    role="button"
    onClick={!disabled ? onClick : undefined}
  >
    <CenterBoth css={style.inner as any}>{children}</CenterBoth>
  </Outer>
);
