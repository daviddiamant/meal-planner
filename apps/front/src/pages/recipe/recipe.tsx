import { useParams } from "react-router-dom";

import { Constrained } from "../../components";
import { useRecipe } from "../../hooks";

export const Recipe = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: recipe } = useRecipe(slug);

  return <Constrained></Constrained>;
};
