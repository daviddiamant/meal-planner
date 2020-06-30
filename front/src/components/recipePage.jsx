import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FelaComponent } from "react-fela";
import { Link } from "react-router-dom";

// Local imports
import AddBtn from "../reduxConnections/addBtn";
import { Btn } from "./btn";
import { BottomMenu } from "./bottomMenu";
import { RecipePageWithData } from "./recipePageWithData";
import { RecipePageWithoutData } from "./recipePageWithoutData";
import { LoadingDots } from "./loadingDots";

const style = {
  recipePage: {
    width: "100%",
  },
  menu: ({ theme }) => ({
    ...theme.constrained,
    ...theme.helpers.flexCenterBoth,
    height: "100%",
    justifyContent: "space-between",
  }),
  toProfile: () => ({
    display: "flex",
    flex: 1,
  }),
  addButton: ({ theme }) => ({
    marginLeft: `${theme.constrainedMargin}px`,
    flex: 1,
  }),
  addIcon: () => ({
    width: "24px",
    height: "24px",
  }),
};

export const RecipePage = ({
  onMount: externalOnMount,
  onUnmount,
  fetched,
  hasRecipeData,
  slug,
  noUser,
  gotPlanned,
  isPlanned,
  ...props
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const onMount = () => {
    externalOnMount(slug);
    return () => {
      onUnmount();
    };
  };
  useEffect(onMount, []);

  // Get the colour for this image
  const vibrantColor = `rgb(${props.recipe.imagePalette?.Vibrant.reduce(
    (a, b) => `${a}, ${b}`
  )})`;

  console.log(gotPlanned);

  return fetched ? (
    <FelaComponent style={style.recipePage}>
      {hasRecipeData ? (
        <RecipePageWithData {...props} vibrantColor={vibrantColor} />
      ) : (
        // Recipe is fetched but we do not have any data for it
        <RecipePageWithoutData image={props.recipe.screenshot} />
      )}
      <BottomMenu>
        <FelaComponent style={style.menu}>
          <a href={props.recipe.url} target="_blank" rel="noopener noreferrer">
            Besök recept
          </a>
          {isPlanned || noUser ? (
            <FelaComponent style={style.toProfile}>
              {({ className }) => (
                <Link className={className} to="/profile">
                  <Btn style={style.addButton} background={vibrantColor}>
                    {noUser ? "Logga in" : "Planerat"}
                  </Btn>
                </Link>
              )}
            </FelaComponent>
          ) : (
            <AddBtn
              style={style.addButton}
              background={vibrantColor}
              stateKey="planRecipeBtn"
              addPath="/api/plannedweek/add"
              value={slug}
              addContent={() => (gotPlanned ? "Planera" : null)}
              addingContent={() => <LoadingDots />}
              successContent={() => (
                <FelaComponent style={style.addIcon}>
                  {({ className }) => (
                    <svg
                      className={className}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  )}
                </FelaComponent>
              )}
              failContent={() => (
                <FelaComponent style={style.addIcon}>
                  {({ className }) => (
                    <svg
                      className={className}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
                    </svg>
                  )}
                </FelaComponent>
              )}
            />
          )}
        </FelaComponent>
      </BottomMenu>
    </FelaComponent>
  ) : null;
};
