import { getApps, initializeApp } from "firebase/app";

import { firebaseConfig } from "../firebaseConfig";

export const ensureFirebaseApp = () => {
  const existingApps = getApps();

  if (!existingApps || !existingApps.length) {
    initializeApp(firebaseConfig);
  }
};
