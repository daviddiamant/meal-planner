import React from "react";
import { FelaComponent } from "react-fela";

// Local imports
import Search from "../reduxConnections/search";
import { SearchHeader } from "./searchHeader";
import SearchResults from "../reduxConnections/searchResults";

const style = {
  content: () => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }),
  inner: () => ({
    flex: 1,
    display: "flex",
    flexDirection: "column",
  }),
};

export const Searchpage = ({ query, focused, animationPivot }) => {
  const sticky = focused || query;
  // When the sticky animations are done
  const completelySticky = animationPivot;

  return (
    <FelaComponent style={style.content}>
      <SearchHeader visible={sticky} />
      <FelaComponent style={style.inner} thin={completelySticky}>
        <Search sticky={sticky} completelySticky={completelySticky} />
        {sticky && completelySticky ? <SearchResults /> : null}
      </FelaComponent>
    </FelaComponent>
  );
};
