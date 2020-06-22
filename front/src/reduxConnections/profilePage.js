import { connect } from "react-redux";

// Local imports
import { ProfilePage as view } from "../components/profilePage";
import { logInStarted } from "../actions/actionCreators";

const mapStateToProps = (state) => {
  return {
    user: state.user,
    display: state.user.gotAuth,
    loggedIn: state.user?.loggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logInStarted: () => dispatch(logInStarted()),
  };
};

const ProfilePage = connect(mapStateToProps, mapDispatchToProps)(view);

export default ProfilePage;
