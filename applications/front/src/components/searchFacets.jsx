import React, { useContext, useEffect } from "react";
import { ThemeContext } from "react-fela";

import SearchFacet from "../reduxConnections/searchFacet";
import Slider from "../reduxConnections/slider";

const style = {
  facetsWrapper: ({ theme, thin }) => ({
    flex: 1,
    width: "100%",
    overflow: "hidden",
    paddingTop: thin ? "20px" : "30px",
    paddingBottom: thin
      ? 0
      : `${theme.navigationHeight + theme.navigationPaddingBottom - 5}px`,
  }),
  facetsInner: ({ theme, thin }) => ({
    width: thin
      ? "max-content"
      : `calc(100% - ${2 * theme.constrainedMargin}px)`,
    height: "100%",
    minHeight: thin ? "42px" : "auto",
    marginRight: thin ? 0 : `${theme.constrainedMargin}px`,
    display: "flex",
    flexWrap: thin ? "nowrap" : "wrap",
    alignContent: "start",
  }),
};

export const SearchFacets = ({
  facets,
  sticky,
  onInput,
  loadFacets,
  searchQuery,
  completelySticky,
}) => {
  const onMount = () => loadFacets();
  useEffect(onMount, []);

  const theme = useContext(ThemeContext);

  let { greyInRgba } = theme.helpers.hexToRgba({
    key: "greyInRgba",
    hex: theme.tertiaryColors.grey,
    a: 1,
  });
  greyInRgba = (greyInRgba.match(/\d+/g) || []).map((x) => parseInt(x));

  const notLoadedFacets = [
    { colors: greyInRgba },
    { colors: greyInRgba },
    { colors: greyInRgba },
    { colors: greyInRgba },
  ];

  return (
    <Slider
      thin={completelySticky}
      style={style.facetsWrapper}
      innerStyle={style.facetsInner}
      blockScroll={!completelySticky}
    >
      {(facets.length ? facets : notLoadedFacets).map((facet, i) => (
        <SearchFacet
          key={i}
          facet={facet}
          sticky={sticky}
          completelySticky={completelySticky}
          onClick={() =>
            searchQuery.includes(facet.title)
              ? searchQuery
              : onInput(`${searchQuery} ${facet.title}`.trim())
          }
        />
      ))}
    </Slider>
  );
};
