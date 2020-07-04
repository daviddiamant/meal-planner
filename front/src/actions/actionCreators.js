import {
  CHANGE_HELLO_WORLD,
  ADD_NAVIGATION_CLICKED,
  NAVIGATION_UNMOUNT,
  NAVIGATION_CLICKED_DONE,
  RECIPE_CLEAN,
  RECIPE_CHANGE_PRIMARY_VIEW,
  CREATE_EXPAND_TEXT,
  REMOVE_EXPAND_TEXT,
  TOGGLE_EXPAND_TEXT,
  CHANGE_HEIGHT_EXPAND_TEXT,
  BROWSE_RECIPES_SCROLL_POSITION,
  START_LOG_IN,
  USER_STATE_CHANGED,
  WEEK_WIDTH_CHANGED,
  FAVORITES_WIDTH_CHANGED,
  REGULAR_MOUNTED,
  GOT_JWT,
  SLIDER_MOVED,
  SLIDER_CARD_CLICKED,
  OPEN_DROPDOWN,
  DROPDOWN_OPENED,
  DROPDOWN_SHOULD_CLOSE,
  CLOSE_DROPDOWN,
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
  LAZY_LOAD_REMOVE_FROM_QUEUE,
  HANDLE_NAVIGATION_ANIMATION,
  START_ADD,
  UPDATE_ADD_RECIPE,
  ADD_ADD_GONE,
  ADD_GOT_RES,
  ADD_ADDING_GONE,
  ADD_DONE,
  ADD_STATUS_GONE,
  START_FETCH_WEEK,
  FETCH_WEEK_DONE,
  FETCH_WEEK_FAILED,
  START_FETCH_FAVORITES,
  FETCH_FAVORITES_DONE,
  FETCH_FAVORITES_FAILED,
  DELETE_FROM_PROFILE,
  DELETE_FROM_PROFILE_DONE,
  DELETE_FROM_PROFILE_FAILED,
  DELETE_FROM_PROFILE_FADE_DONE,
  DELETE_FROM_PROFILE_ANIMATIONS_DONE,
} from "./actionTypes";

export function changeHelloWorld(newMessage) {
  return {
    type: CHANGE_HELLO_WORLD,
    newMessage,
  };
}

export function clickedNavigationItem(linkFrom, linkTo) {
  return {
    type: ADD_NAVIGATION_CLICKED,
    pathFrom: linkFrom,
    path: linkTo,
  };
}

export function navigationUnmounted() {
  return { type: NAVIGATION_UNMOUNT };
}

export function clickedNavigationItemDone(linkTo) {
  return {
    type: NAVIGATION_CLICKED_DONE,
    path: linkTo,
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

export function logInStarted() {
  return {
    type: START_LOG_IN,
  };
}

export function weekWidthChanged() {
  return {
    type: WEEK_WIDTH_CHANGED,
  };
}

export function favoritesWidthChanged() {
  return {
    type: FAVORITES_WIDTH_CHANGED,
  };
}

export function userStateChanged(user) {
  return {
    type: USER_STATE_CHANGED,
    user,
  };
}

export function gotJWT(JWT) {
  return { type: GOT_JWT, JWT };
}

export function regularMounted() {
  return {
    type: REGULAR_MOUNTED,
  };
}

export function updateAddRecipe(url) {
  return {
    type: UPDATE_ADD_RECIPE,
    url,
  };
}

export function sliderMoved(sliderKey) {
  return { type: SLIDER_MOVED, sliderKey };
}

export function sliderCardClicked(sliderKey, slug) {
  return { type: SLIDER_CARD_CLICKED, sliderKey, slug };
}

export function openDropdown(stateKey) {
  return { type: OPEN_DROPDOWN, stateKey };
}

export function dropdownOpened(stateKey) {
  return { type: DROPDOWN_OPENED, stateKey };
}

export function dropdownShouldClose(stateKey) {
  return { type: DROPDOWN_SHOULD_CLOSE, stateKey };
}

export function closeDropdown(stateKey) {
  return { type: CLOSE_DROPDOWN, stateKey };
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

export function removeFromQueue(url) {
  return {
    type: LAZY_LOAD_REMOVE_FROM_QUEUE,
    url,
  };
}

export function handleNavigationAnimation() {
  return {
    type: HANDLE_NAVIGATION_ANIMATION,
  };
}

export function startAdd(stateKey, path, value) {
  return {
    type: START_ADD,
    stateKey,
    path,
    value,
  };
}

export function addAddGone(stateKey) {
  return {
    type: ADD_ADD_GONE,
    stateKey,
  };
}

export function addGotRes(stateKey, res) {
  return {
    type: ADD_GOT_RES,
    stateKey,
    res,
  };
}

export function addAddingGone(stateKey) {
  return {
    type: ADD_ADDING_GONE,
    stateKey,
  };
}

export function addDone(stateKey) {
  return {
    type: ADD_DONE,
    stateKey,
  };
}

export function addStatusGone(stateKey) {
  return {
    type: ADD_STATUS_GONE,
    stateKey,
  };
}

export function startFetchWeek(force = false) {
  return {
    type: START_FETCH_WEEK,
    force,
  };
}

export function fetchWeekDone(week) {
  return {
    type: FETCH_WEEK_DONE,
    week,
  };
}

export function fetchWeekFailed(err) {
  return {
    type: FETCH_WEEK_FAILED,
    err,
  };
}

export function startFetchFavorites(force = false) {
  return {
    type: START_FETCH_FAVORITES,
    force,
  };
}

export function fetchFavoritesDone(favorites) {
  return {
    type: FETCH_FAVORITES_DONE,
    favorites,
  };
}

export function fetchFavoritesFailed(err) {
  return {
    type: FETCH_FAVORITES_FAILED,
    err,
  };
}

export function deleteFromProfile(sliderKey, slug) {
  return { type: DELETE_FROM_PROFILE, sliderKey, slug };
}

export function deleteFromProfileSuccess() {
  return { type: DELETE_FROM_PROFILE_DONE };
}

export function deleteFromProfileFailed(err) {
  return { type: DELETE_FROM_PROFILE_FAILED, err };
}

export function deleteFromProfileFadeDone(sliderKey, slug) {
  return { type: DELETE_FROM_PROFILE_FADE_DONE, sliderKey, slug };
}

export function deleteFromProfileDone(sliderKey, slug) {
  return { type: DELETE_FROM_PROFILE_ANIMATIONS_DONE, sliderKey, slug };
}
