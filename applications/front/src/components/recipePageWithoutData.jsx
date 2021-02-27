import React, { Fragment, useContext } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useHistory } from "react-router-dom";

// Local imports
import { TopMenu } from "./topMenu";
import { IMAGE_URL } from "../appConfig";

const style = {
  topMenu: ({ theme }) => ({
    ...theme.constrained,
    ...theme.helpers.flexCenterBoth,
    justifyContent: "space-between",
    height: "100%",
  }),
  topMenuScreenshot: ({ theme }) => ({
    background: theme.background,
  }),
  backButton: ({ color }) => ({
    width: "50px",
    height: "50px",
    color,
  }),
  screenshot: ({ theme }) => ({
    width: "100%",
    height: "auto",
    marginTop: `${theme.navigationHeight}px`,
  }),
};

export const RecipePageWithoutData = ({ image }) => {
  const theme = useContext(ThemeContext);
  const history = useHistory();

  return (
    <Fragment>
      <TopMenu>
        <FelaComponent style={[style.topMenu, style.topMenuScreenshot]}>
          {({ className }) => (
            <div className={className}>
              <FelaComponent
                style={style.backButton}
                color={theme.backButtonColors.dark}
              >
                {({ className }) => (
                  <svg
                    className={className}
                    fill="currentColor"
                    stroke="none"
                    viewBox="0 0 24 20"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    onClick={
                      history.length > 2
                        ? history.goBack
                        : () => history.push("/")
                    }
                  >
                    <path d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"></path>
                  </svg>
                )}
              </FelaComponent>
            </div>
          )}
        </FelaComponent>
      </TopMenu>
      <FelaComponent style={style.screenshot}>
        {({ className }) => (
          <img
            className={className}
            src={`${IMAGE_URL}${image}`}
            alt="Screenshot av receptet"
          />
        )}
      </FelaComponent>
    </Fragment>
  );
};
