import React, { useContext } from "react";
import { animated, useTransition } from "react-spring";
import { FelaComponent, ThemeContext } from "react-fela";

import NotFound from "../svgs/notFound";

const style = {
  noResWrapper: ({ theme }) => ({
    ...theme.constrained,
    ...theme.helpers.flexCenterBoth,
    flexDirection: "column",
  }),
  noRes: () => ({
    width: "75%",
    height: "auto",
    marginBottom: "50px",
  }),
  noResText: ({ theme }) => ({
    width: "90%",
    color: theme.textColors.secondary,
  }),
};

export const NoSearchResults = () => {
  const theme = useContext(ThemeContext);

  const transitions = useTransition(true, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <FelaComponent style={style.noResWrapper} key={key}>
          {({ className }) => (
            <animated.div className={className} style={props}>
              <FelaComponent style={style.noRes}>
                {({ className }) => (
                  <NotFound className={className} theme={theme}></NotFound>
                )}
              </FelaComponent>
              <FelaComponent style={theme.helpers.resetHeaders} as="h4">
                Inga recept matchade sökningen.
              </FelaComponent>
              <FelaComponent style={style.noResText} as="p">
                Testa söka på något annat. Eller varför inte lägga till fler
                recept?
              </FelaComponent>
            </animated.div>
          )}
        </FelaComponent>
      )
  );
};
