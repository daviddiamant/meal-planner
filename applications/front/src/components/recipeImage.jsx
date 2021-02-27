import React, { useContext } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useWindowSize } from "@react-hook/window-size";

// Local imports
import useScaledRecipeImageDimensions from "../hooks/useScaledRecipeImageDimensions";
import LazyLoadedImage from "../reduxConnections/lazyLoadedImage";
import { IMAGE_URL } from "../appConfig";
import { AnimateWithScroll } from "./animateWithScroll";

const style = {
  imageWrapper: ({ theme, height }) => ({
    ...theme.helpers.flexCenterBoth,
    position: "fixed",
    width: "100%",
    height: `${height}px`,
  }),
  image: ({ width }) => ({
    width,
    height: "auto",
    margin: "auto",
  }),
  imageOverlay: ({ theme, width, height }) => ({
    position: "absolute",
    width: `${width}px`,
    height: `${height + theme.primary.borderRadius + 50 /* some extra */}px`,
  }),
};

export const RecipeImage = ({
  recipe: { title, image, smallImage, imageWidth, imageHeight },
}) => {
  const [windowWidth, windowHeight] = useWindowSize();
  const [
    scaledImageWidth,
    scaledImageHeight,
    zoomDiff,
  ] = useScaledRecipeImageDimensions(windowWidth, imageWidth, imageHeight);
  const theme = useContext(ThemeContext);

  return scaledImageHeight ? (
    <FelaComponent style={style.imageWrapper}>
      {({ className }) => (
        <AnimateWithScroll
          className={className}
          scrollRange={{ min: 0, max: scaledImageHeight }}
          animateKeys="top"
          initialValues={zoomDiff / 2}
          stopValues={scaledImageHeight / 4 + zoomDiff / 2}
          valueFormats={(val) => `-${val}px`}
        >
          <FelaComponent style={style.image} height={scaledImageHeight}>
            {({ className }) => (
              <div className={className}>
                <LazyLoadedImage
                  crossOrigin="Anonymous"
                  className={className}
                  src={`${IMAGE_URL}${image}`}
                  smallSrc={`${IMAGE_URL}${smallImage}`}
                  alt={title}
                  stateKey="recipePageLazyLoadedImages"
                  autoLoadSmall={true}
                  clearOnUnmount={true}
                  width={scaledImageWidth}
                />
              </div>
            )}
          </FelaComponent>
          <FelaComponent
            style={style.imageOverlay}
            height={windowHeight}
            width={scaledImageWidth}
          >
            {({ className }) => {
              const steps = { 0: 0 };
              const fullOverlayScrollPosition =
                scaledImageHeight -
                theme.navigationHeight -
                theme.primary.borderRadius;
              const navbarHeightInPercent =
                theme.primary.borderRadius / fullOverlayScrollPosition;
              steps[1 - navbarHeightInPercent] = 1;
              steps[1] = 1;
              return (
                <AnimateWithScroll
                  className={className}
                  scrollRange={{
                    min: scaledImageHeight / 2,
                    max:
                      scaledImageHeight -
                      theme.navigationHeight -
                      theme.primary.borderRadius,
                  }}
                  animateKeys="background"
                  steps={steps}
                  valueFormats={(val) =>
                    `${theme.background
                      .split(",")
                      .slice(0, 3)
                      .join(",")}, ${val})`
                  }
                ></AnimateWithScroll>
              );
            }}
          </FelaComponent>
        </AnimateWithScroll>
      )}
    </FelaComponent>
  ) : null;
};
