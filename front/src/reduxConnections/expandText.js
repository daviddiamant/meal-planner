import { createRef } from "react";
import { connect } from "react-redux";

// Local imports
import { ExpandText as view } from "../components/expandText";
import {
  createExpandText,
  removeExpandText,
  toggleExpandText,
} from "../actions/actionCreators";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const ExpandText = connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(view);

export default ExpandText;
