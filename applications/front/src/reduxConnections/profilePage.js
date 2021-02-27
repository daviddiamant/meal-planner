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
  const defaultSliders = [{}, {}, {}, {}, {}, {}];
  return {
    user: state.user,
    display: state.user.gotAuth,
    loggedIn: state.user?.loggedIn,
    // Six placeholders while fetching
    week: state.profile.isFetchingWeek
      ? defaultSliders
      : state.profile.week.length
      ? state.profile.week
      : defaultSliders,
    favorites: state.profile.isFetchingFavorites
      ? defaultSliders
      : state.profile.favorites.length
      ? state.profile.favorites
      : defaultSliders,
    isDefaultWeek: !state.profile.isFetchingWeek && !state.profile.week.length,
    isDefaultFavorites:
      !state.profile.isFetchingFavorites && !state.profile.favorites.length,
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
