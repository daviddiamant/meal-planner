import { Link } from "react-router-dom";

import { Heading, LazyImage } from "../../components";
import { useWeek } from "../../hooks";

export const Profile = (): JSX.Element => {
  const { data: week } = useWeek();

  return (
    <>
      <div role="banner">
        <Heading>Planerad vecka</Heading>
      </div>
      <div>
        <ul>
          {week?.map(({ mediumImage, slug, smallImage, title }) => (
            <li key={slug}>
              <Link to={`/recipe/${slug}`}>{title}</Link>
              <LazyImage
                alt={`Bild för ${title}`}
                css={{ width: "125px", height: "125px", overflow: "hidden" }}
                largeUrl={mediumImage}
                smallUrl={smallImage}
              />
            </li>
          ))}
        </ul>
        <br />
        <br />
      </div>
    </>
  );
};
