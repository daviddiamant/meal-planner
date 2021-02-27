import algoliasearch from "algoliasearch/lite";
import { debounce, put, take, takeEvery, select } from "redux-saga/effects";

// Local imports
import { ALGOLIA_APP_ID } from "../appConfig";
import { setSearchResult, setSearchFacets } from "../actions/actionCreators";
import {
  SEARCH_RECIPES,
  FETCH_SEARCH_FACETS,
  FETCH_USER_DONE,
} from "../actions/actionTypes";

let index;
const defaultFacets = [
  {
    title: "Huvudrätt",
    image: "/recipe-images/kycklinggryta/image-medium.jpeg",
    colors: [232, 198, 132],
  },
  {
    title: "Vegetariskt",
    image: "/recipe-images/kramig-potatis-och-purjolokssoppa/image-medium.jpeg",
    colors: [129, 178, 154],
  },
  {
    title: "Snabblagat",
    image: "/recipe-images/gronkalspasta-med-parmesan/image-medium.jpeg",
    colors: [237, 216, 153],
  },
  {
    title: "Efterrätt",
    image: "/recipe-images/karleksmums-eller-snoddas/image-medium.jpeg",
    colors: [200, 233, 250],
  },
];

function* createAlgoliaInstance() {
  let algoliaSearchKey = yield select((state) => state.user.algoliaSearchKey);
  if (!algoliaSearchKey) {
    // Wait for the algoliaSearchKey to arrive
    algoliaSearchKey = yield take(FETCH_USER_DONE);
    algoliaSearchKey = algoliaSearchKey.user.algoliaSearchKey;
  }

  const client = algoliasearch(ALGOLIA_APP_ID, algoliaSearchKey);
  index = client.initIndex("recipes");
}

function* fetchFacets() {
  const cachedFacets = yield select((state) => state.search.facets);

  if (cachedFacets.length > 0) {
    // This is cached, no need to fetch
    yield put(setSearchFacets(cachedFacets ?? []));
    return;
  }

  if (!index) {
    yield createAlgoliaInstance();
  }

  let {
    facets: { keywords: facets },
  } = yield index.search("", {
    facets: ["*"],
  });

  const facetKeys = Object.keys(facets);
  facets =
    facets && facetKeys?.length > 3
      ? yield Promise.all(
          facetKeys.splice(0, 4).map(async (facet) => {
            const facetResult = await index.search(facet, {
              hitsPerPage: 25,
            });

            let chosenIndex;
            let randomRecipeFromFacet;
            do {
              chosenIndex = Math.floor(Math.random() * facetResult.hits.length);
              randomRecipeFromFacet = facetResult.hits[chosenIndex];
            } while (!randomRecipeFromFacet?.imagePalette?.LightVibrant);

            return {
              title: facet,
              image: randomRecipeFromFacet.mediumImage,
              colors: randomRecipeFromFacet.imagePalette.LightVibrant,
            };
          })
        )
      : defaultFacets;

  yield put(setSearchFacets(facets ?? []));
}

function* search({ query }) {
  if (!index) {
    yield createAlgoliaInstance();
  }

  const result = query ? yield index.search(query) : null;

  yield put(setSearchResult(result?.hits ?? []));
}

export function* searchSaga() {
  yield debounce(450, SEARCH_RECIPES, search);
  yield takeEvery(FETCH_SEARCH_FACETS, fetchFacets);
}
