import { Navigate } from "react-router-dom";

import { Btn, CenterBoth, Constrained } from "../../components";
import { useUser } from "../../hooks";
import { CSS, css, Style, theme } from "../../stitches.config";
import { EatingTogether } from "../../svgs";

const style: Style = {
  outer: {
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "justify",
  },
  image: {
    width: "80%",
    height: "auto",
    marginTop: "45%",
  },
  inner: {
    flex: 1,
    width: "80%",
  },
};

export const Login = (): JSX.Element | null => {
  const { login, user } = useUser();

  if (typeof user === "undefined") {
    return null;
  }

  return user ? (
    <Navigate to="/profile" />
  ) : (
    <Constrained css={style.outer}>
      <CenterBoth css={style.outer}>
        <EatingTogether
          className={css(style.image as CSS)}
          theme={theme}
        ></EatingTogether>
        <CenterBoth css={style.inner}>
          <div>
            <p>
              Logga in för att kunna lägga till recept, planera din matvecka och
              en massa annat kul!
            </p>
            <Btn onClick={login}>Logga in</Btn>
          </div>
        </CenterBoth>
      </CenterBoth>
    </Constrained>
  );
};
