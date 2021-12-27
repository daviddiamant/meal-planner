import { Paths, Responses } from "@meal-planner/types";
import {
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQuery,
  UseQueryResult,
} from "react-query";

import { API_URL } from "../appConfig";
import { axiosDataGetter } from "../utils";

export const useRecipe = (
  slug: string
): UseQueryResult<Responses["Recipe"] | undefined> =>
  useQuery<Responses["Recipe"] | undefined>(
    ["recipe", slug],
    axiosDataGetter<Responses["Recipe"]>(
      "get",
      API_URL + Paths.Recipe.replace(":slug", slug)
    )
  );

export const useRecipes = (): UseInfiniteQueryResult<Responses["Recipes"]> =>
  useInfiniteQuery<Responses["Recipes"]>(
    "recipes",
    async ({ pageParam = 1 }) => {
      const recipesPerPage = 64;
      const to = pageParam * recipesPerPage;
      const from = to - recipesPerPage;

      const path = Paths.Recipes.replace(":to", to.toString()).replace(
        ":from",
        from.toString()
      );

      return axiosDataGetter<Responses["Recipes"]>("get", API_URL + path)();
    },
    {
      getNextPageParam: ({ hasMoreRecipes }, allPages) =>
        hasMoreRecipes ? allPages.length + 1 : undefined,
    }
  );
