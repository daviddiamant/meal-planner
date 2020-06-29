import { connect } from "react-redux";

// Local imports
import { AddBtn as view } from "../components/addBtn";
import {
  startAdd,
  addAddGone,
  addAddingGone,
  addStatusGone,
} from "../actions/actionCreators";

const mapStateToProps = (state, { stateKey }) => {
  const showAdd = !state[stateKey].isAdding && state[stateKey].status === null;
  const showAdding =
    state[stateKey].isAdding && state[stateKey].status === null;
  const showSuccess = state[stateKey].status === true;
  const showFail = state[stateKey].status === false;

  return {
    adding: state[stateKey].isAdding,
    // Only one icon at a time
    showAdd:
      showAdd &&
      !(state[stateKey].addingShowing || state[stateKey].statusShowing),
    showAdding:
      showAdding &&
      !(state[stateKey].addShowing || state[stateKey].statusShowing),
    showSuccess:
      showSuccess &&
      !(state[stateKey].addShowing || state[stateKey].addingShowing),
    showFail:
      showFail &&
      !(state[stateKey].addShowing || state[stateKey].addingShowing),
  };
};

const mapDispatchToProps = (dispatch, { stateKey }) => {
  return {
    onAdd: (path, value) => dispatch(startAdd(stateKey, path, value)),
    onAddOut: () => dispatch(addAddGone(stateKey)),
    onAddingOut: () => dispatch(addAddingGone(stateKey)),
    onStatusOut: () => dispatch(addStatusGone(stateKey)),
  };
};

const AddBtn = connect(mapStateToProps, mapDispatchToProps)(view);

export default AddBtn;
