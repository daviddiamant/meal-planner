import React, { Fragment, useContext, useEffect, useRef } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { useWindowSize } from "@react-hook/window-size";

// Local imports
import { Header } from "./header";
import { HeaderTitle } from "./headerTitle";
import { SliderMessage } from "./sliderMessage";
import Slider from "../reduxConnections/slider";
import SliderCard from "../reduxConnections/sliderCard";
import AddRecipeBox from "../reduxConnections/addRecipeBox";
import Dropdown from "../reduxConnections/dropdown";
import DropdownItem from "../reduxConnections/dropdownItem";
import useShareWeekText from "../hooks/useShareWeekText";

const sliderMarginTop = 25;
const profileImageHeight = 35;
const style = {
  inner: () => ({}),
  constrainedContent: ({ theme }) => ({
    ...theme.constrained,
  }),
  top: ({ withMenu }) => ({ margin: `${withMenu ? 85 : 70}px 0 0 0` }),
  image: ({ theme, withMenu }) => ({
    position: "absolute",
    top: `${theme.constrainedMargin}px`,
    right: withMenu ? "auto" : `${theme.constrainedMargin}px`,
    left: withMenu ? `${theme.constrainedMargin}px` : "auto",
    height: `${profileImageHeight}px`,
    width: "auto",
    borderRadius: `${theme.primary.borderRadius - 3}px`,
  }),
  sliderContainer: () => ({
    position: "relative",
    marginTop: `${sliderMarginTop}px`,
  }),
  slider: ({ isDefault }) => ({
    filter: `blur(${isDefault ? 3.5 : 0}px)`,
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
  topMenuButton: ({ theme }) => {
    const dimension = 30;
    return {
      position: "absolute",
      top: `${
        theme.constrainedMargin + (profileImageHeight - dimension) / 2
      }px`,
      right: `${theme.constrainedMargin - 8}px`,
      height: `${dimension}px`,
      width: `${dimension}px`,
      marginBottom: `${(profileImageHeight - dimension) / 2}px`,
      boxSizing: "border-box",
    };
  },
};

const shareWeek = ({ title, text }) => {
  if (!title || !text || !(navigator && navigator.share)) {
    return;
  }

  // Share it
  navigator.share({
    title,
    text,
  });
};

export const ProfilePageUser = ({
  onMount,
  user: { name, image },
  week,
  isDefaultWeek,
  weekWidthAdjusted,
  favorites,
  isDefaultFavorites,
  favoritesWidthAdjusted,
}) => {
  const addRef = useRef();
  const slugToWeekKey = useRef({});
  const slugToFavoritesKey = useRef({});
  const headerRef = useRef();
  const [, windowHeight] = useWindowSize();
  const theme = useContext(ThemeContext);
  const rightMenu = true;
  const sharingCapabilities = navigator && navigator.share;
  const shareObject = useShareWeekText(week);
  const rightMenuButton = useRef();

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
        <FelaComponent style={style.image} withMenu={rightMenu}>
          {({ className }) => (
            <img src={image} className={className} alt="Profilbild" />
          )}
        </FelaComponent>
        {rightMenu ? (
          <Fragment>
            <FelaComponent style={style.topMenuButton}>
              {({ className }) => (
                <div className={className} ref={rightMenuButton}>
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </div>
              )}
            </FelaComponent>
            <Dropdown stateKey="profileDropdown" trigger={rightMenuButton}>
              {sharingCapabilities ? (
                <DropdownItem
                  stateKey="profileDropdown"
                  icon={
                    <svg
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                  }
                  onClick={() => shareWeek(shareObject)}
                >
                  Dela veckoplanering
                </DropdownItem>
              ) : null}
              <DropdownItem
                stateKey="profileDropdown"
                icon={
                  <svg
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                }
              >
                {/* Not implemented */}
                Inställningar
              </DropdownItem>
            </Dropdown>
          </Fragment>
        ) : null}
        <HeaderTitle
          style={style.top}
          topTitle="Hejsan"
          bottomTitle={name}
          withMenu={rightMenu}
        />
      </Header>
      <FelaComponent style={style.inner}>
        <FelaComponent style={style.constrainedContent}>
          <AddRecipeBox externalRef={addRef} />
        </FelaComponent>
        <FelaComponent style={style.sliderContainer}>
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
            <Slider
              slider="week"
              style={style.slider}
              isDefault={isDefaultWeek}
            >
              {week.map((recipe, i) => {
                /**
                 * Avoid re-renders on delete. If we have seen a slug before, keep it's last index.
                 * Otherwise the dom-element for the deleted meal will remain but get new image data.
                 */

                let index;
                if (
                  recipe?.slug &&
                  typeof slugToWeekKey.current[recipe.slug] !== "undefined"
                ) {
                  index = slugToWeekKey.current[recipe.slug];
                } else {
                  index = i;
                  slugToWeekKey.current[recipe.slug] = i;
                }
                return (
                  <SliderCard
                    sliderKey="week"
                    key={index}
                    index={i}
                    data={recipe}
                    height={height}
                    onRest={weekWidthAdjusted}
                    lazyLoadedStateKey="weekLazyLoadedImages"
                  />
                );
              })}
            </Slider>
          ) : null}
          {isDefaultWeek ? (
            <SliderMessage>
              <h4>Du har inte planerat några recept</h4>
            </SliderMessage>
          ) : null}
        </FelaComponent>
        <FelaComponent style={style.sliderContainer}>
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
            <Slider
              slider="favorites"
              style={style.slider}
              isDefault={isDefaultFavorites}
            >
              {favorites.map((recipe, i) => {
                /**
                 * Avoid re-renders on delete. If we have seen a slug before, keep it's last index.
                 * Otherwise the dom-element for the deleted meal will remain but get new image data.
                 */

                let index;
                if (
                  recipe?.slug &&
                  typeof slugToFavoritesKey.current[recipe.slug] !== "undefined"
                ) {
                  index = slugToFavoritesKey.current[recipe.slug];
                } else {
                  index = i;
                  slugToFavoritesKey.current[recipe.slug] = i;
                }
                return (
                  <SliderCard
                    sliderKey="favorites"
                    key={index}
                    index={i}
                    data={recipe}
                    height={height}
                    onRest={favoritesWidthAdjusted}
                    lazyLoadedStateKey="favoritesLazyLoadedImages"
                  />
                );
              })}
            </Slider>
          ) : null}
          {isDefaultFavorites ? (
            <SliderMessage>
              <h4>Du har inga favoriter</h4>
            </SliderMessage>
          ) : null}
        </FelaComponent>
      </FelaComponent>
    </FelaComponent>
  );
};
