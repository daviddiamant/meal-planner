import { Fragment, ReactNode, useState } from "react";
import { Link } from "react-router-dom";

import { Heading, LazyImage } from "../../components";
import { useFacets, useSearch } from "../../hooks";

const Wrap = ({
  children,
  to,
}: {
  to: string | undefined;
  children: ReactNode;
}) => (to ? <Link to={to}>{children}</Link> : <Fragment>{children}</Fragment>);

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
            ({ mediumImage, slug = "/", smallImage, title }, i) => (
              <li key={title + i}>
                <Wrap to={searchResult?.length ? `/recipe/${slug}` : undefined}>
                  {title}
                  <LazyImage
                    alt={`Bild för ${title}`}
                    css={{
                      width: "125px",
                      height: "125px",
                      overflow: "hidden",
                    }}
                    largeUrl={mediumImage}
                    smallUrl={smallImage}
                  />
                </Wrap>
              </li>
            )
          )}
        </ul>
      </>
    </>
  );
};
