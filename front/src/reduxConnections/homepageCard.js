import { connect } from "react-redux";

import { HomepageCard as view } from "../components/homepageCard";
import { removeFromQueue } from "../actions/actionCreators";

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => {
  return {
    onUnmount: (image) => dispatch(removeFromQueue(image)),
  };
};

const HomepageCard = connect(mapStateToProps, mapDispatchToProps)(view);

export default HomepageCard;
