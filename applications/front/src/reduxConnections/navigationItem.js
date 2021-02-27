import { connect } from "react-redux";

import { NavigationItem as view } from "../components/navigationItem";
import {
  clickedNavigationItem,
  clickedNavigationItemDone,
  handleNavigationAnimation,
} from "../actions/actionCreators";

const mapStateToProps = (state, props) => {
  return {
    isClicked: state.navigationItems.clicked.some((x) => x === props.linkTo),
  };
};

const mapDispatchToProps = (dispatch, props) => {
  return {
    handleClick: () => {
      dispatch(clickedNavigationItem(props.linkFrom, props.linkTo));
    },
    clickDone: () => {
      dispatch(clickedNavigationItemDone(props.linkTo));
    },
    animationDone: () => {
      dispatch(handleNavigationAnimation());
    },
  };
};

const NavigationItem = connect(mapStateToProps, mapDispatchToProps)(view);

export default NavigationItem;
