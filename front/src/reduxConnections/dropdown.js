import { connect } from "react-redux";

// Local imports
import { Dropdown as view } from "../components/dropdown";
import {
  openDropdown,
  dropdownOpened,
  dropdownShouldClose,
} from "../actions/actionCreators";

const mapStateToProps = (state, { stateKey }) => {
  if (typeof state[stateKey] === "undefined") {
    throw new Error(
      `Unknown statekey in redux-connector dropdown.js - "${stateKey}"`
    );
  }

  return {
    shouldOpen: state[stateKey].shouldOpen,
    isOpen: state[stateKey].open,
  };
};

const mapDispatchToProps = (dispatch, { stateKey }) => ({
  open: () => dispatch(openDropdown(stateKey)),
  onOpened: () => dispatch(dropdownOpened(stateKey)),
  shouldClose: () => dispatch(dropdownShouldClose(stateKey)),
});

const Dropdown = connect(mapStateToProps, mapDispatchToProps)(view);

export default Dropdown;
