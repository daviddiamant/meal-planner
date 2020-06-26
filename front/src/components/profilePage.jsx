import React from "react";
import * as firebase from "firebase/app";
import "firebase/auth";

// Local imports
import { ProfilePageUser } from "../components/profilePageUser";
import { ProfilePageLogIn } from "../components/profilePageLogIn";

export const ProfilePage = ({
  onMount,
  display,
  loggedIn,
  logInStarted,
  user,
  week,
  weekWidthAdjusted,
  favorites,
  favoritesWidthAdjusted,
}) => {
  return display ? (
    loggedIn ? (
      <ProfilePageUser
        onMount={onMount}
        user={user}
        week={week}
        weekWidthAdjusted={weekWidthAdjusted}
        favorites={favorites}
        favoritesWidthAdjusted={favoritesWidthAdjusted}
      />
    ) : (
      <ProfilePageLogIn
        logIn={() => {
          logInStarted();
          const provider = new firebase.auth.GoogleAuthProvider();
          firebase.auth().signInWithPopup(provider);
        }}
      />
    )
  ) : null;
};
