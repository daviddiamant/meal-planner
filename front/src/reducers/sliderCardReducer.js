import { SLIDER_MOVED, SLIDER_CARD_CLICKED } from "../actions/actionTypes";

export function sliderCardReducer(state = [], action) {
  switch (action.type) {
    case SLIDER_CARD_CLICKED:
      if (
        state.some(
          (x) => x.slider === action.sliderKey && x.slug === action.slug
        )
      ) {
        // This is "unclicking"
        return state.filter(
          (x) => x.slider !== action.sliderKey || x.slug !== action.slug
        );
      }

      // Only allow one in each slider
      return [
        ...state.filter((x) => x.slider !== action.sliderKey),
        { slider: action.sliderKey, slug: action.slug },
      ];

    case SLIDER_MOVED:
      // Remove all clicked on move
      return state.filter((x) => x.slider !== action.sliderKey);

    default:
      return state;
  }
}
