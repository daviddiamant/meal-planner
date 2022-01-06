import { useState } from "react";

import { Heading, LazyImage } from "../../components";
import { useFacets, useSearch } from "../../hooks";

export const Search = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const { data: facets } = useFacets();
  const { data: searchResult, refetch: search } = useSearch(query);

  return (
    <>
      <Heading>Sök</Heading>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={() => search()}>Sök</button>
      <>
        <Heading as="h3">
          {searchResult?.length ? "Resultat:" : "Mest använda sökord:"}
        </Heading>
        <ul>
          {(searchResult?.length ? searchResult : facets)?.map(
            ({ mediumImage, smallImage, title }, i) => (
              <li key={title + i}>
                {title}
                <LazyImage
                  alt={`Bild för ${title}`}
                  css={{ width: "125px", height: "125px", overflow: "hidden" }}
                  largeUrl={mediumImage}
                  smallUrl={smallImage}
                />
              </li>
            )
          )}
        </ul>
      </>
    </>
  );
};
