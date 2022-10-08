import { Paths, Responses } from "@meal-planner/types";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";

import { API_URL } from "../appConfig";
import { axiosDataGetter, ensureFirebaseApp } from "../utils";

const login = async () => {
  ensureFirebaseApp();

  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  auth.useDeviceLanguage();

  signInWithPopup(auth, provider);
};

export const useUser = (): {
  user: User | null | undefined;
  login: () => Promise<void>;
} => {
  const [user, setUser] = useState<User | null>();

  const onMount = () => {
    ensureFirebaseApp();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  };
  useEffect(onMount, []);

  return { user, login };
};

export const useUserConfig = (): UseQueryResult<
  Responses["UserConfig"] | undefined
> => {
  const { user } = useUser();

  return useQuery<Responses["UserConfig"] | undefined>(
    [`${user?.uid}-config`],
    axiosDataGetter<Responses["UserConfig"]>("get", API_URL + Paths.UserConfig),
    { enabled: !!user }
  );
};
