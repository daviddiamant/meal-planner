import React, { Fragment, useContext } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useHistory } from "react-router-dom";
import { useWindowSize } from "@react-hook/window-size";

// Local imports
import useScaledRecipeImageDimensions from "../hooks/useScaledRecipeImageDimensions";
import { ExpandText } from "./expandText";
import { TopMenu } from "./topMenu";
import { AnimateWithScroll } from "./animateWithScroll";
import { RecipeImage } from "./recipeImage";
import { Tab } from "./tab";
import { SwipeArea } from "./swipeArea";

const style = {
  topMenu: ({ theme, backButtonColor }) => ({
    ...theme.constrained,
    ...theme.helpers.flexCenterBoth,
    justifyContent: "space-between",
    height: "100%",
    color:
      backButtonColor === "light"
        ? theme.backButtonColors.light
        : theme.backButtonColors.dark,
  }),
  backButton: () => ({
    width: "50px",
    height: "50px",
  }),
  content: ({ theme, imageHeight }) => ({
    ...theme.contentWithBottomBar,
    position: "relative",
    top: `${imageHeight - theme.primary.borderRadius - 5}px`,
    paddingTop: `${theme.primary.borderRadius}px`,
    background: theme.background,
    borderRadius: `${theme.primary.borderRadius}px`,
  }),
  topText: ({ theme }) => ({
    ...theme.constrained,
    marginTop: "10px",
    textAlign: "justify",
    color: theme.textColors.secondary,
  }),
  title: ({ theme }) => ({
    textAlign: "left",
    fontSize: "7.5vw",
    color: theme.textColors.primary,
  }),
  recipe: {
    marginTop: "0",
  },
  tabs: ({ theme }) => ({
    ...theme.constrained,
    ...theme.helpers.flexCenterBoth,
    justifyContent: "space-between",
    width: "100%",
  }),
  recipeContents: () => ({
    display: "grid",
    marginTop: "35px",
    gridAutoRows: "auto",
    gap: "20px 10px",
  }),
  recipeIngredients: {
    gridTemplateColumns: "auto min-content",
  },
  recipeInstructions: {
    gridTemplateColumns: "min-content auto",
  },
  recipeRow: {
    display: "contents",
  },
  recipeLeft: {},
  recipeRight: {},
  recipeLeftText: ({ theme }) => ({
    margin: "0",
    fontSize: "4vw",
    lineHeight: theme.primaryLineHeight,
    whiteSpace: "break-spaces",
    ":first-letter": {
      textTransform: "uppercase",
    },
  }),
  recipeLeftTextBig: {
    minWidth: "35px",
    fontSize: "6vw",
    fontStyle: "italic",
    lineHeight: 1.3,
  },
  recipeRightText: {
    margin: "0",
  },
  recipeRightUnits: {
    maxWidth: "175px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};

export const RecipePageWithData = ({
  recipe,
  vibrantColor,
  backButtonColor,
  changeTab,
  isIngredientsSelected,
  isMethodSelected,
  ...props
}) => {
  const {
    imageHeight,
    imageWidth,
    title,
    description,
    ingredients,
    instructions,
  } = recipe;

  const theme = useContext(ThemeContext);
  const history = useHistory();

  // Get the height of the image, with ratios in the range [3:4, 4:3]
  const [windowWidth] = useWindowSize();
  const scaledImageHeight = useScaledRecipeImageDimensions(
    windowWidth,
    imageWidth,
    imageHeight
  )[1];

  return scaledImageHeight > 0 ? (
    <Fragment>
      <TopMenu removeBorder={true}>
        <FelaComponent style={style.topMenu} backButtonColor={backButtonColor}>
          {({ className }) => (
            <AnimateWithScroll
              className={className}
              scrollRange={{
                at:
                  scaledImageHeight -
                  theme.navigationHeight -
                  theme.primary.borderRadius,
              }}
              animateKeys={[
                "background",
                "color",
                "filter",
                "WebkitFilter",
                "borderBottom",
              ]}
              initialValues={[
                0,
                backButtonColor === "light"
                  ? theme.backButtonColors.light
                  : theme.backButtonColors.dark,
                0.25,
                0.25,
                0,
              ]}
              stopValues={[1, theme.backButtonColors.dark, 0, 0, 1]}
              valueFormats={[
                (val) =>
                  `${theme.background
                    .split(",")
                    .slice(0, 3)
                    .join(",")}, ${val})`,
                (val) => val,
                (val) => `drop-shadow( 0px 0px 5px rgba(0, 0, 0, ${val}))`,
                (val) => `drop-shadow( 0px 0px 5px rgba(0, 0, 0, ${val}))`,
                (val) => `${val}px solid ${theme.quaternaryColors.grey}`,
              ]}
              immediate={[true, false, false, false, true]}
            >
              <FelaComponent style={style.backButton}>
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
            </AnimateWithScroll>
          )}
        </FelaComponent>
      </TopMenu>
      <RecipeImage {...props} recipe={recipe} />
      <FelaComponent style={style.content} imageHeight={scaledImageHeight}>
        <FelaComponent style={style.topText}>
          <FelaComponent style={style.title} as="h1">
            {title}
          </FelaComponent>
          <ExpandText numLines={3}>{description}</ExpandText>
        </FelaComponent>
        <FelaComponent style={style.recipe}>
          <FelaComponent style={style.tabs}>
            <Tab
              selected={isIngredientsSelected || false}
              changeTo="ingredients"
              changeTab={changeTab}
              vibrantColor={vibrantColor}
            >
              <button>Ingredienser</button>
            </Tab>
            <Tab
              selected={isMethodSelected || false}
              changeTo="method"
              changeTab={changeTab}
              vibrantColor={vibrantColor}
            >
              <button>Instruktioner</button>
            </Tab>
          </FelaComponent>
          <SwipeArea
            selected={isIngredientsSelected ? "ingredients" : "method"}
            selectionCallbacks={[
              () => changeTab("ingredients"),
              () => changeTab("method"),
            ]}
          >
            <FelaComponent
              style={[style.recipeContents, style.recipeIngredients]}
              type="ingredients"
            >
              {ingredients.map((ingredient, i) => (
                <FelaComponent key={i} style={style.recipeRow}>
                  <FelaComponent style={style.recipeLeft}>
                    <FelaComponent style={style.recipeLeftText} as="h3">
                      {ingredient.ingredient.split("(").join("\n(")}
                    </FelaComponent>
                  </FelaComponent>
                  <FelaComponent style={style.recipeRight}>
                    <FelaComponent
                      style={[
                        style.recipeRightText,
                        style.recipeRightUnits,
                        theme.helpers.tar,
                      ]}
                      as="p"
                    >
                      {ingredient.unit}
                    </FelaComponent>
                  </FelaComponent>
                </FelaComponent>
              ))}
            </FelaComponent>
            <div type="method">
              {instructions.map((section, i) => (
                <Fragment key={i}>
                  {section.name !== title ? <h4>{section.name}</h4> : null}
                  <FelaComponent
                    style={[style.recipeContents, style.recipeInstructions]}
                  >
                    {section.instructions.map((instruction, j) => (
                      <FelaComponent key={j} style={style.recipeRow}>
                        <FelaComponent style={style.recipeLeft}>
                          <FelaComponent
                            style={[
                              style.recipeLeftText,
                              style.recipeLeftTextBig,
                            ]}
                            as="h3"
                          >
                            {j + 1}.
                          </FelaComponent>
                        </FelaComponent>
                        <FelaComponent style={style.recipeRight}>
                          <FelaComponent style={style.recipeRightText} as="p">
                            {instruction}
                          </FelaComponent>
                        </FelaComponent>
                      </FelaComponent>
                    ))}
                  </FelaComponent>
                </Fragment>
              ))}
            </div>
          </SwipeArea>
        </FelaComponent>
      </FelaComponent>
    </Fragment>
  ) : null;
};
