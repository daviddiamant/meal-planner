import { connect } from "react-redux";

// Local imports
import { Slider as view } from "../components/slider";
import { sliderMoved } from "../actions/actionCreators";

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch, { slider }) => {
  return {
    onMove: () => dispatch(sliderMoved(slider)),
  };
};

const Slider = connect(mapStateToProps, mapDispatchToProps)(view);

export default Slider;
