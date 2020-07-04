import { connect } from "react-redux";

// Local imports
import { DropdownItem as view } from "../components/dropdownItem";
import { closeDropdown, dropdownShouldClose } from "../actions/actionCreators";

const mapStateToProps = (state, { stateKey }) => {
  if (typeof state[stateKey] === "undefined") {
    throw new Error(
      `Unknown statekey in redux-connector dropdownItem.js - "${stateKey}"`
    );
  }

  return {
    display: state[stateKey].open && !state[stateKey].shouldClose,
  };
};

const mapDispatchToProps = (dispatch, { stateKey }) => ({
  onFadeout: () => dispatch(closeDropdown(stateKey)),
  shouldCloseDropdown: () => dispatch(dropdownShouldClose(stateKey)),
});

const DropdownItem = connect(mapStateToProps, mapDispatchToProps)(view);

export default DropdownItem;
