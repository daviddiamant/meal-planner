import { connect } from "react-redux";

// Local imports
import { ProfilePage as view } from "../components/profilePage";
import {
  logInStarted,
  startFetchWeek,
  weekWidthChanged,
  startFetchFavorites,
  favoritesWidthChanged,
} from "../actions/actionCreators";

const mapStateToProps = (state) => {
  return {
    user: state.user,
    display: state.user.gotAuth,
    loggedIn: state.user?.loggedIn,
    // Six placeholders while fetching
    week: state.profile.isFetchingWeek
      ? [{}, {}, {}, {}, {}, {}]
      : state.profile.week,
    favorites: state.profile.isFetchingFavorites
      ? [{}, {}, {}, {}, {}, {}]
      : state.profile.favorites,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onMount: () => {
      dispatch(startFetchWeek());
      dispatch(startFetchFavorites());
    },
    logInStarted: () => dispatch(logInStarted()),
    weekWidthAdjusted: () => dispatch(weekWidthChanged()),
    favoritesWidthAdjusted: () => dispatch(favoritesWidthChanged()),
  };
};

const ProfilePage = connect(mapStateToProps, mapDispatchToProps)(view);

export default ProfilePage;
