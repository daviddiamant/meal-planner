import { Heading, LazyImage } from "../../components";
import { useFacets } from "../../hooks";

export const Search = (): JSX.Element => {
  const { data: facets } = useFacets();

  return (
    <>
      <Heading>Sök</Heading>
      <Heading as="h3">Mest använda sökord:</Heading>
      <ul>
        {facets?.map(({ mediumImage, smallImage, title }) => (
          <li key={title}>
            {title}
            <LazyImage
              alt={`Bild för ${title}`}
              css={{ width: "125px", height: "125px", overflow: "hidden" }}
              largeUrl={mediumImage}
              smallUrl={smallImage}
            />
          </li>
        ))}
      </ul>
    </>
  );
};
