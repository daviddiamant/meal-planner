import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FelaComponent } from "react-fela";
import { useDispatch } from "react-redux";

// Local imports
import { startFetchRecipe, cleanRecipe } from "../actions/actionCreators";
import { BottomMenu } from "./bottomMenu";
import { RecipePageWithData } from "./recipePageWithData";
import { RecipePageWithoutData } from "./recipePageWithoutData";

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
  addButton: ({ theme, background }) => ({
    display: "inline",
    minHeight: "50px",
    flex: 1,
    padding: "0 35px 0 35px",
    marginLeft: `${theme.constrainedMargin}px`,
    textAlign: "center",
    whiteSpace: "nowrap",
    fontFamily: '"Poppins", sans-serif',
    fontSize: "20px",
    fontWeight: "400",
    background,
    color: theme.backButtonColors.light,
    borderRadius: `${theme.primary.borderRadius}px`,
    ...theme.helpers.flexCenterBoth,
    justifyContent: "space-around",
  }),
};

export const RecipePage = ({ fetched, hasRecipeData, slug, ...props }) => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    dispatch(startFetchRecipe(slug));
    return () => {
      dispatch(cleanRecipe());
    };
  }, [slug, dispatch]);

  // Get the colour for this image
  const vibrantColor = `rgb(${props.recipe.imagePalette?.Vibrant.reduce(
    (a, b) => `${a}, ${b}`
  )})`;

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
          <FelaComponent style={style.addButton} background={vibrantColor}>
            Planera
          </FelaComponent>
        </FelaComponent>
      </BottomMenu>
    </FelaComponent>
  ) : null;
};
