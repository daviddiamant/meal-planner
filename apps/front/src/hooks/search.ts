import { RecipeInIndex } from "@meal-planner/types";
import { useQuery, UseQueryResult } from "react-query";

import { getAlgoliaIndex } from "../utils";
import { useUserConfig } from ".";

interface FacetResult {
  title: string;
  smallImage: string;
  mediumImage: string;
  color: [number, number, number];
}

const defaultFacets: FacetResult[] = [
  {
    title: "Huvudrätt",
    smallImage: "/recipe-images/kycklinggryta/image-small.jpeg",
    mediumImage: "/recipe-images/kycklinggryta/image-medium.jpeg",
    color: [232, 198, 132],
  },
  {
    title: "Vegetariskt",
    smallImage:
      "/recipe-images/kramig-potatis-och-purjolokssoppa/image-small.jpeg",
    mediumImage:
      "/recipe-images/kramig-potatis-och-purjolokssoppa/image-medium.jpeg",
    color: [129, 178, 154],
  },
  {
    title: "Snabblagat",
    smallImage: "/recipe-images/gronkalspasta-med-parmesan/image-small.jpeg",
    mediumImage: "/recipe-images/gronkalspasta-med-parmesan/image-medium.jpeg",
    color: [237, 216, 153],
  },
  {
    title: "Efterrätt",
    smallImage: "/recipe-images/karleksmums-eller-snoddas/image-small.jpeg",
    mediumImage: "/recipe-images/karleksmums-eller-snoddas/image-medium.jpeg",
    color: [200, 233, 250],
  },
];

export const useFacets = (): UseQueryResult<FacetResult[] | undefined> => {
  const { data: userConfig } = useUserConfig();
  const { algoliaSearchKey } = userConfig || {};

  return useQuery<FacetResult[] | undefined>(
    "facets",
    async (): Promise<FacetResult[] | undefined> => {
      if (!algoliaSearchKey) {
        return;
      }

      const algolia = getAlgoliaIndex(algoliaSearchKey);

      const { facetHits } = await algolia.searchForFacetValues("keywords", "", {
        maxFacetHits: 4,
        sortFacetValuesBy: "count",
      });

      const algoliaFacets = await Promise.all(
        facetHits.map(async (facet) => {
          const recipesFromFacet = await algolia.search<RecipeInIndex>(
            facet.value,
            {
              hitsPerPage: 20,
            }
          );

          let randomIndex;
          let randomRecipe;
          do {
            randomIndex = Math.floor(
              Math.random() * recipesFromFacet.hits.length
            );

            randomRecipe = recipesFromFacet.hits[randomIndex];
          } while (!randomRecipe?.imagePalette?.LightVibrant);

          return {
            title: facet.value,
            smallImage: randomRecipe.smallImage,
            mediumImage: randomRecipe.mediumImage,
            color: randomRecipe.imagePalette.LightVibrant,
          };
        })
      );

      return [
        ...algoliaFacets,
        ...defaultFacets.splice(0, defaultFacets.length - algoliaFacets.length),
      ];
    },
    {
      enabled: !!algoliaSearchKey,
    }
  );
};
