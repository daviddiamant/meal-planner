import { combineReducers } from "redux";

// Import the individual reducers
import { helloWorldReducer } from "./helloWorldReducer";
import { navigationItemsReducer } from "./navigationItemsReducer";
import { recipeReducer } from "./recipeReducer";
import { recipesReducer } from "./recipesReducer";
import { lazyLoadImageReducer } from "./lazyLoadImageReducer";
import { lazyLoadQueueReducer } from "./lazyLoadQueueReducer";
import { expandTextReducer } from "./expandTextReducer";
import { userReducer } from "./userReducer";
import { addRecipeInputReducer } from "./addRecipeInputReducer";
import { profileReducer } from "./profileReducer";
import { addReducer } from "./addReducer";

// An object that tells what reducers handle what part of the state
let allReducers = {};

// HelloWorldReducer handles the key 'helloWordMessage' in the state
allReducers = { ...allReducers, helloWordMessage: helloWorldReducer };

// navigationItemsReducer handles the key 'navigationItems' in the state
allReducers = { ...allReducers, navigationItems: navigationItemsReducer };

// recipeReducer handles the key 'recipePage' in the state
allReducers = { ...allReducers, recipePage: recipeReducer };

// recipesReducer handles the key 'browseRecipes' in the state
allReducers = { ...allReducers, browseRecipes: recipesReducer };

// lazyLoadQueueReducer handles the keys 'smallLazyLoadQueue' and 'largeLazyLoadQueue' in the state
allReducers = {
  ...allReducers,
  smallLazyLoadQueue: (state = [], action) =>
    lazyLoadQueueReducer("smallLazyLoadQueue", state, action),
};
allReducers = {
  ...allReducers,
  largeLazyLoadQueue: (state = [], action) =>
    lazyLoadQueueReducer("largeLazyLoadQueue", state, action),
};

// lazyLoadImageReducer handles the keys 'homepageLazyLoadedImages', 'weekLazyLoadedImages', 'favoritesLazyLoadedImages',  and 'recipePageLazyLoadedImages' in the state
allReducers = {
  ...allReducers,
  homepageLazyLoadedImages: (state = {}, action) =>
    lazyLoadImageReducer("homepageLazyLoadedImages", state, action),
};
allReducers = {
  ...allReducers,
  recipePageLazyLoadedImages: (state = {}, action) =>
    lazyLoadImageReducer("recipePageLazyLoadedImages", state, action),
};
allReducers = {
  ...allReducers,
  weekLazyLoadedImages: (state = {}, action) =>
    lazyLoadImageReducer("weekLazyLoadedImages", state, action),
};
allReducers = {
  ...allReducers,
  favoritesLazyLoadedImages: (state = {}, action) =>
    lazyLoadImageReducer("favoritesLazyLoadedImages", state, action),
};

// expandTextReducer handles the key 'expandText' in the state
allReducers = { ...allReducers, expandText: expandTextReducer };

// userReducer handles the key 'user' in the state
allReducers = { ...allReducers, user: userReducer };

// addRecipeInputReducer handles the key 'addRecipeInput' in the state
allReducers = { ...allReducers, addRecipeInput: addRecipeInputReducer };

// addReducer handles the key 'addRecipeBtn' and 'planRecipeBtn' in the state
allReducers = {
  ...allReducers,
  addRecipeBtn: (state = {}, action) =>
    addReducer("addRecipeBtn", state, action),
};
allReducers = {
  ...allReducers,
  planRecipeBtn: (state = {}, action) =>
    addReducer("planRecipeBtn", state, action),
};

// profileReducer handles the key 'profile' in the state
allReducers = { ...allReducers, profile: profileReducer };

export const mainReducer = combineReducers(allReducers);
