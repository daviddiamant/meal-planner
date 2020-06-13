import {
  CHANGE_HELLO_WORLD,
  ADD_NAVIGATION_CLICKED,
  NAVIGATION_CLICKED_DONE,
  SET_RECIPE_COLORS,
  RECIPE_CLEAN,
  RECIPE_CHANGE_PRIMARY_VIEW,
  CREATE_EXPAND_TEXT,
  REMOVE_EXPAND_TEXT,
  TOGGLE_EXPAND_TEXT,
  CHANGE_HEIGHT_EXPAND_TEXT,
  BROWSE_RECIPES_SCROLL_POSITION,
  // Async actions
  START_FETCH_RECIPE,
  FETCH_RECIPE_DONE,
  FETCH_RECIPE_FAILED,
  START_FETCH_RECIPES,
  FETCH_RECIPES_DONE,
  FETCH_RECIPES_FAILED,
  FETCH_RECIPES_CLEAN,
  LAZY_LOAD_PROCESS_SMALL_QUEUE,
  LAZY_LOAD_PROCESS_LARGE_QUEUE,
  LAZY_LOAD_IMAGE,
  GOT_SMALL_LAZY_LOADED,
  LAZY_LOAD_CLEAR_FOR_LARGE,
  GOT_LARGE_LAZY_LOADED,
  LAZY_LOAD_DONE,
  LAZY_LOAD_CLEAN,
  HANDLE_NAVIGATION_ANIMATION,
} from "./actionTypes";

export function changeHelloWorld(newMessage) {
  return {
    type: CHANGE_HELLO_WORLD,
    newMessage,
  };
}

export function clickedNavigationItem(linkTo) {
  return {
    type: ADD_NAVIGATION_CLICKED,
    path: linkTo,
  };
}

export function clickedNavigationItemDone(linkTo) {
  return {
    type: NAVIGATION_CLICKED_DONE,
    path: linkTo,
  };
}

export function setRecipePageColors(imgData) {
  return {
    type: SET_RECIPE_COLORS,
    imgData,
  };
}

export function cleanRecipe() {
  return {
    type: RECIPE_CLEAN,
  };
}

export function changeRecipePrimaryView(primaryView) {
  return {
    type: RECIPE_CHANGE_PRIMARY_VIEW,
    primaryView,
  };
}

export function createExpandText() {
  return {
    type: CREATE_EXPAND_TEXT,
  };
}

export function removeExpandText() {
  return {
    type: REMOVE_EXPAND_TEXT,
  };
}

export function toggleExpandText(id) {
  return {
    type: TOGGLE_EXPAND_TEXT,
    id,
  };
}

export function changeHeightExpandText(id, outerHeight, innerHeight) {
  return {
    type: CHANGE_HEIGHT_EXPAND_TEXT,
    id,
    outerHeight,
    innerHeight,
  };
}

export function browseRecipesScrollPosition(scrollY) {
  return {
    type: BROWSE_RECIPES_SCROLL_POSITION,
    scrollY,
  };
}

// Async actions
export function startFetchRecipe(slug) {
  return {
    type: START_FETCH_RECIPE,
    slug,
  };
}

export function fetchRecipeDone(recipe) {
  return {
    type: FETCH_RECIPE_DONE,
    recipe,
  };
}

export function fetchRecipeFailed(err) {
  return {
    type: FETCH_RECIPE_FAILED,
    err,
  };
}

export function startFetchRecipes() {
  return {
    type: START_FETCH_RECIPES,
  };
}

export function fetchRecipesDone(recipes) {
  return {
    type: FETCH_RECIPES_DONE,
    recipes,
  };
}

export function fetchRecipesFailed(err) {
  return {
    type: FETCH_RECIPES_FAILED,
    err,
  };
}

export function cleanFetchRecipes() {
  return {
    type: FETCH_RECIPES_CLEAN,
  };
}

export function processLazyLoadSmallQueue() {
  return {
    type: LAZY_LOAD_PROCESS_SMALL_QUEUE,
  };
}

export function processLazyLoadLargeQueue() {
  return {
    type: LAZY_LOAD_PROCESS_LARGE_QUEUE,
  };
}

export function lazyLoadImage(url, smallUrl = null, stateKey = null) {
  return {
    type: LAZY_LOAD_IMAGE,
    url,
    smallUrl,
    stateKey,
  };
}

export function gotSmallLazyLoaded(url, localURL, stateKey = null) {
  return {
    type: GOT_SMALL_LAZY_LOADED,
    url,
    localURL,
    stateKey,
  };
}

export function clearForLazyLargeImage(url, stateKey = null) {
  return {
    type: LAZY_LOAD_CLEAR_FOR_LARGE,
    url,
    stateKey,
  };
}

export function gotLargeLazyLoaded(url, stateKey = null) {
  return {
    type: GOT_LARGE_LAZY_LOADED,
    url,
    stateKey,
  };
}

export function lazyLoadDone(url, stateKey = null) {
  return {
    type: LAZY_LOAD_DONE,
    url,
    stateKey,
  };
}

export function cleanUpLazyLoading(currentURLs, stateKey = null) {
  return {
    type: LAZY_LOAD_CLEAN,
    currentURLs,
    stateKey,
  };
}

export function handleNavigationAnimation() {
  return {
    type: HANDLE_NAVIGATION_ANIMATION,
  };
}
