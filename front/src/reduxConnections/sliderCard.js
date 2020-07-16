import { connect } from "react-redux";

// Local imports
import { SliderCard as view } from "../components/sliderCard";
import {
  sliderCardClicked,
  deleteFromProfile,
  deleteFromProfileDone,
  deleteFromProfileFadeDone,
} from "../actions/actionCreators";

const mapStateToProps = (
  state,
  { sliderKey, index, height, data: { slug } }
) => {
  const gotImageState =
    state.profile[sliderKey] && state.profile[sliderKey][index];
  const isDeleted = gotImageState && state.profile[sliderKey][index].isDeleted;
  const isFaded = gotImageState && state.profile[sliderKey][index].isFaded;

  return {
    isClicked: state.clickedSliderCards.some(
      (x) => x.slider === sliderKey && x.slug === slug
    ),
    isDeleted,
    isFaded,
    height: isDeleted && isFaded ? 0 : height,
    showServerDependant: state.serverReachable,
  };
};

const mapDispatchToProps = (dispatch, { sliderKey, data: { slug } }) => {
  return {
    onClick: () => dispatch(sliderCardClicked(sliderKey, slug)),
    onDelete: () => dispatch(deleteFromProfile(sliderKey, slug)),
    onFadeOutDone: () => dispatch(deleteFromProfileFadeDone(sliderKey, slug)),
    onDeleteDone: () => dispatch(deleteFromProfileDone(sliderKey, slug)),
  };
};

const SliderCard = connect(mapStateToProps, mapDispatchToProps)(view);

export default SliderCard;
