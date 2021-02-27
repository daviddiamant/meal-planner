import React from "react";
import { FelaComponent } from "react-fela";

const style = {
  facetCircle: () => ({
    position: "absolute",
    width: "20vw",
    height: "20vw",
    borderRadius: "100%",
    transition: "background 350ms ease-in-out",
  }),
  facesTopCircle: ({ colors: [r, g, b], darkOpacity }) => ({
    top: "1%",
    left: "-35%",
    background: `rgba(${r}, ${g}, ${b}, ${darkOpacity})`,
  }),
  facesBottomCircle: ({ colors: [r, g, b], lightOpacity }) => ({
    bottom: "1%",
    right: "-30%",
    background: `rgba(${r}, ${g}, ${b}, ${lightOpacity})`,
  }),
  facesImageCircle: ({ image, colors: [r, g, b] }) => ({
    top: "-16%",
    right: "-16%",
    width: "30vw",
    height: "30vw",
    borderRadius: "100%",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundBlendMode: "lighten",
    backgroundImage: `url(${image})`,
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.35)`,
    transition: "none",
  }),
};

export const SearchFacetCircle = ({
  top = false,
  image = null,
  bottom = false,
  ...props
}) => (
  <FelaComponent
    style={[
      style.facetCircle,
      image
        ? style.facesImageCircle
        : top
        ? style.facesTopCircle
        : bottom
        ? style.facesBottomCircle
        : null,
    ]}
    image={image || null}
    {...props}
  />
);
