import { connect } from "react-redux";

import { NavigationItem as view } from "../components/navigationItem";
import {
  clickedNavigationItem,
  clickedNavigationItemDone,
} from "../actions/actionCreators";

const mapStateToProps = (state, props) => {
  return {
    isClicked: state.navigationItems.clicked.some((x) => x === props.linkTo),
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    handleClick: () => {
      dispatch(clickedNavigationItem(props.linkTo));
    },
    clickDone: () => {
      dispatch(clickedNavigationItemDone(props.linkTo));
    },
  };
};

const NavigationItem = connect(mapStateToProps, mapDispatchToProps)(view);

export default NavigationItem;
