import React, { useContext, useEffect, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useWindowSize } from "@react-hook/window-size";

// Local imports
import { Header } from "./header";
import { Slider } from "./slider";
import { WeekCard } from "./weekCard";
import AddRecipeBox from "../reduxConnections/addRecipeBox";

const sliderMarginTop = 25;
const style = {
  inner: () => ({}),
  constrainedContent: ({ theme }) => ({
    ...theme.constrained,
  }),
  top: () => ({
    display: "flex",
    margin: "70px 0 0 0",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  greeting: {
    fontSize: "6vw",
    ":first-letter": {
      marginLeft: "-0.27vw",
    },
  },
  name: ({ theme }) => ({
    marginTop: "5px",
    fontSize: "9vw",
    fontWeight: "200",
    color: theme.textColors.secondary,
    ":first-letter": {
      marginLeft: "-0.62vw",
    },
  }),
  image: ({ theme }) => ({
    position: "absolute",
    top: `${theme.constrainedMargin}px`,
    right: `${theme.constrainedMargin}px`,
    height: "35px",
    width: "auto",
    borderRadius: `${theme.primary.borderRadius - 3}px`,
  }),
  slider: () => ({
    marginTop: `${sliderMarginTop}px`,
  }),
  halfAndHalfTitle: ({ theme, show }) => ({
    marginTop: 0,
    marginBottom: "10px",
    fontWeight: "300",
    color: theme.textColors.secondary,
    opacity: show ? 1 : 0,
  }),
  firstWord: ({ theme }) => ({
    fontWeight: "600",
    color: theme.textColors.primary,
  }),
};

export const ProfilePageUser = ({
  onMount,
  user: { name, image },
  week,
  weekWidthAdjusted,
  favorites,
  favoritesWidthAdjusted,
}) => {
  const addRef = useRef();
  const headerRef = useRef();
  const [, windowHeight] = useWindowSize();
  const theme = useContext(ThemeContext);

  useEffect(onMount, []);

  let height =
    // The whole screen
    windowHeight -
    // Remove everything above the sliders
    (addRef.current?.offsetTop + addRef.current?.offsetHeight) -
    // Remove the headers hights
    2 * headerRef.current?.offsetHeight -
    // Remove the margins
    2 * sliderMarginTop -
    // And one for the bottom as well
    sliderMarginTop -
    // Remove the navbar
    (theme.navigationHeight + theme.navigationPaddingBottom) -
    // Throw in some extra margin for the fun of it
    5;

  height = Math.floor(height / 2);
  height = height < 100 ? 100 : height;

  // We need the refs to be mounted before we have a height
  const haveCalculatedSliderHeight = !isNaN(height);

  return (
    <FelaComponent style={style.content}>
      <Header>
        <FelaComponent style={style.image}>
          {({ className }) => (
            <img src={image} className={className} alt="Profilbild" />
          )}
        </FelaComponent>
        <FelaComponent style={[style.constrainedContent, style.top]}>
          <div>
            <FelaComponent
              style={[theme.helpers.resetHeaders, style.greeting]}
              as="h2"
            >
              Hejsan
            </FelaComponent>
            <FelaComponent
              style={[theme.helpers.resetHeaders, style.name]}
              as="h3"
            >
              {name}
            </FelaComponent>
          </div>
        </FelaComponent>
      </Header>
      <FelaComponent style={style.inner}>
        <FelaComponent style={style.constrainedContent}>
          <AddRecipeBox externalRef={addRef} />
        </FelaComponent>
        <FelaComponent style={style.slider}>
          <FelaComponent style={style.constrainedContent}>
            <FelaComponent
              style={style.halfAndHalfTitle}
              show={haveCalculatedSliderHeight}
            >
              {({ className }) => (
                <h3 className={className} ref={headerRef}>
                  <FelaComponent style={style.firstWord} as="span">
                    Veckans
                  </FelaComponent>{" "}
                  recept
                </h3>
              )}
            </FelaComponent>
          </FelaComponent>
          {haveCalculatedSliderHeight ? (
            <Slider>
              {week.map((recipe, i) => (
                <WeekCard
                  key={i}
                  index={i}
                  data={recipe}
                  height={height}
                  onRest={weekWidthAdjusted}
                  lazyLoadedStateKey="weekLazyLoadedImages"
                />
              ))}
            </Slider>
          ) : null}
        </FelaComponent>
        <FelaComponent style={style.slider}>
          <FelaComponent style={style.constrainedContent}>
            <FelaComponent
              style={style.halfAndHalfTitle}
              show={haveCalculatedSliderHeight}
              as="h3"
            >
              <FelaComponent style={style.firstWord} as="span">
                Dina
              </FelaComponent>{" "}
              favoriter
            </FelaComponent>
          </FelaComponent>
          {haveCalculatedSliderHeight ? (
            <Slider>
              {favorites.map((recipe, i) => (
                <WeekCard
                  key={i}
                  index={i}
                  data={recipe}
                  height={height}
                  onRest={favoritesWidthAdjusted}
                  lazyLoadedStateKey="favoritesLazyLoadedImages"
                />
              ))}
            </Slider>
          ) : null}
        </FelaComponent>
      </FelaComponent>
    </FelaComponent>
  );
};
