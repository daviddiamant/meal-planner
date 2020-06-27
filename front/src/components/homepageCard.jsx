import React, { useContext } from "react";
import { FelaComponent, ThemeContext } from "react-fela";
import { Link } from "react-router-dom";

// Local imports
import LazyLoadedImage from "../reduxConnections/lazyLoadedImage";

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

export const HomepageCard = ({ index, data, width }) => {
  const {
    slug,
    title,
    mediumImage,
    smallImage,
    mediumImageWidth,
    mediumImageHeight,
  } = data;

  const url = `${window.location.protocol}//${window.location.hostname}`;
  const theme = useContext(ThemeContext);

  width -= theme.homepageCardMargin;
  const ratio = mediumImageHeight / mediumImageWidth;
  const height = width * ratio;
  const toStyle = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <Link to={`/recipe/${slug}`}>
      <FelaComponent key={index} style={style.card} {...toStyle} as="div">
        <FelaComponent style={style.cardImage}>
          {({ className }) => (
            <LazyLoadedImage
              className={className}
              src={url + mediumImage}
              smallSrc={url + smallImage}
              {...toStyle}
              extraMargin={index === 0 ? 1 : 0}
              alt={title}
              stateKey="homepageLazyLoadedImages"
            />
          )}
        </FelaComponent>
      </FelaComponent>
    </Link>
  );
};
