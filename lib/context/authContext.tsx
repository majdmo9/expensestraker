"use client";

import { createContext, useContext, useEffect } from "react";
import { AuthStateHook, useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

import { useRouter } from "next/navigation";
import { auth } from "../firebase";

const authContext = createContext<{
  user: AuthStateHook["0"];
  loading: AuthStateHook["1"];
  googleLoginHandler: () => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  loading: false,
  googleLoginHandler: async () => {},
  logout: async () => {},
});

const AuthContextProvider = ({ children }: { children: React.ReactElement }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const googleProvider = new GoogleAuthProvider();
  const googleLoginHandler = async () => {
    try {
      signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const logout = async () => {
    signOut(auth);
  };

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/");
    }
  }, [user]);

  return <authContext.Provider value={{ user, loading, logout, googleLoginHandler }}>{children}</authContext.Provider>;
};

export default AuthContextProvider;

export const useAuthContext = () => useContext(authContext);
