import React, { useContext } from "react";
import { FelaComponent, ThemeContext } from "react-fela";

// Local imports
import { Btn } from "./btn";

const style = {
  content: ({ theme }) => ({
    ...theme.constrained,
    ...theme.helpers.flexCenterBoth,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    textAlign: "justify",
  }),
  inner: ({ theme }) => ({
    ...theme.helpers.flexCenterBoth,
    marginBottom: `${theme.navigationHeight + theme.navigationPaddingBottom}px`,
    flex: 1,
    width: "80%",
    flexDirection: "column",
  }),
  topImg: {
    width: "100%",
    marginTop: "75px",
  },
  button: {
    width: "auto",
  },
};

export const ProfilePageLogIn = ({ logIn }) => {
  const theme = useContext(ThemeContext);

  return (
    <FelaComponent style={style.content}>
      <FelaComponent style={style.topImg}>
        {({ className }) => (
          <img
            className={className}
            src={`${window.location.protocol}//${window.location.hostname}/recipe-images/undraw_eating_together.png`}
            alt={"Äter tillsammans"}
          />
        )}
      </FelaComponent>

      <FelaComponent style={style.inner}>
        <div>
          <p>
            Logga in för att kunna lägga till recept, planera din matvecka och
            en massa annat kul!
          </p>
          <Btn
            style={style.button}
            background={theme.primaryColors.yellow}
            onClick={logIn}
          >
            Logga in
          </Btn>
        </div>
      </FelaComponent>
    </FelaComponent>
  );
};
