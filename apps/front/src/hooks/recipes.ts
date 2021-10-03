import { Paths, Responses } from "@meal-planner/types";
import { useQuery } from "react-query";

import { API_URL } from "../appConfig";
import { axiosDataGetter } from "../utils";

export const useRecipes = (
  from: number,
  to: number,
  onSettled: (data: Responses["Recipes"] | undefined) => void
) =>
  useQuery<Responses["Recipes"] | undefined>(
    ["recipes", from, to],
    axiosDataGetter<Responses["Recipes"]>(
      "get",
      API_URL +
        Paths.Recipes.replace(":from", from.toString()).replace(
          ":to",
          to.toString()
        )
    ),
    { onSettled }
  );
