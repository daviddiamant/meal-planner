import React, { useContext } from "react";
import { animated } from "react-spring";
import { Link } from "react-router-dom";
import { FelaComponent, ThemeContext } from "react-fela";

// Local imports
import LazyLoadedImage from "../reduxConnections/lazyLoadedImage";
import { IMAGE_URL } from "../appConfig";

const style = {
  card: ({ theme, height, width }) => ({
    height,
    width,
    margin: `${theme.homepageCardMargin}px 0 0 ${theme.homepageCardMargin}px`,
    background: theme.quaternaryColors.grey,
    borderRadius: `${theme.primary.borderRadius}px`,
    overflow: "hidden",
  }),
  cardImage: () => ({
    overflow: "hidden",
  }),
};

export const MasonryCard = ({
  data,
  width,
  index,
  animation = null,
  removeMargin = true,
  style: externalStyle,
  autoLoadSmall = false,
  innerStyle: externalInnerStyle,
  stateKey: componentStateKey = null,
}) => {
  const {
    slug,
    title,
    smallImage,
    mediumImage,
    mediumImageWidth,
    mediumImageHeight,
    stateKey: dataStateKey,
  } = data;

  const stateKey = dataStateKey ?? componentStateKey;
  const theme = useContext(ThemeContext);

  width -= removeMargin ? theme.homepageCardMargin : 0;
  const ratio = mediumImageHeight / mediumImageWidth;
  const height = width * ratio;
  const toStyle = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <FelaComponent style={externalStyle}>
      {({ className }) => (
        <animated.div className={className} style={animation}>
          <Link to={`/recipe/${slug}`}>
            <FelaComponent
              key={index}
              style={[style.card, externalInnerStyle]}
              {...toStyle}
              as="div"
            >
              <FelaComponent style={style.cardImage}>
                {({ className }) => (
                  <LazyLoadedImage
                    {...toStyle}
                    alt={title}
                    stateKey={stateKey}
                    className={className}
                    src={IMAGE_URL + mediumImage}
                    autoLoadSmall={autoLoadSmall}
                    extraMargin={index === 0 ? 1 : 0}
                    smallSrc={IMAGE_URL + smallImage}
                  />
                )}
              </FelaComponent>
            </FelaComponent>
          </Link>
        </animated.div>
      )}
    </FelaComponent>
  );
};
