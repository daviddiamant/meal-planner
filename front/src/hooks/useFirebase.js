import { useEffect, useState } from "react";
import firebase from "firebase/app";

// Local imports
import firebaseConfig from "../firebaseConfig";

function useFirebase() {
  const [firebaseApp, setFirebaseApp] = useState(null);

  const onMount = () => {
    const firebaseApp =
      firebase.apps && firebase.apps.length > 0
        ? firebase.apps[0]
        : firebase.initializeApp(firebaseConfig);

    setFirebaseApp(firebaseApp);
  };
  useEffect(onMount, []);

  return firebaseApp;
}

export default useFirebase;
