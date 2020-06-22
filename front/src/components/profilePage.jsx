import React from "react";
import * as firebase from "firebase/app";
import "firebase/auth";

// Local imports
import { ProfilePageUser } from "../components/profilePageUser";
import { ProfilePageLogIn } from "../components/profilePageLogIn";

export const ProfilePage = ({ display, loggedIn, user, logInStarted }) => {
  return display ? (
    loggedIn ? (
      <ProfilePageUser user={user} />
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
