import { useState } from "react";
import { Link } from "react-router-dom";

import { Heading, LazyImage } from "../../components";
import { useAddRecipe, useUser, useWeek } from "../../hooks";

export const Profile = (): JSX.Element | null => {
  const [recipeUrl, setRecipeUrl] = useState("");

  const { user } = useUser();
  const { data: week } = useWeek();
  const {
    isError: isAddError,
    isSuccess: isAddSuccess,
    mutate: addRecipe,
  } = useAddRecipe(recipeUrl);

  return user ? (
    <>
      <div role="banner">
        <Heading>Hej {user.displayName}</Heading>
      </div>
      <br />
      <Heading as="h3">Lägg till nytt recept i kokboken</Heading>
      <input
        type="url"
        value={recipeUrl}
        onChange={(e) => setRecipeUrl(e.target.value)}
      />
      {isAddSuccess ? (
        <p>Tillagt i kokboken!</p>
      ) : isAddError ? (
        <p>Kunde inte lägga till.</p>
      ) : null}
      <button onClick={addRecipe}>Lägg till</button>
      <br />
      <br />
      <Heading as="h3">Planerade recept</Heading>
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
  ) : null;
};
