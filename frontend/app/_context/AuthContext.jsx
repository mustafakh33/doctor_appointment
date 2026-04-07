"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearAuth,
  getCurrentUser,
  loginUser,
  readAuth,
  registerUser,
  requestPasswordReset,
  resetPassword,
  updateCurrentUser,
  verifyResetCode,
} from "@/app/_utils/Api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const storedSession = readAuth();

    if (storedSession?.user) {
      setUser(storedSession.user);
      setToken(storedSession.token || "");

      if (storedSession.token && typeof window !== "undefined") {
        window.localStorage.setItem(
          "doctor_appointment_token",
          storedSession.token,
        );
      }
    }

    if (storedSession?.token) {
      getCurrentUser()
        .then((latestProfile) => {
          if (latestProfile) {
            setUser(latestProfile);
          }
        })
        .catch(() => {
          // Keep the cached session if the profile request fails.
        });
    }

    setInitializing(false);
  }, []);

  const syncSession = (session) => {
    setUser(session?.user || null);
    setToken(session?.token || "");
  };

  const login = async (payload) => {
    const session = await loginUser(payload);
    syncSession(session);
    return session;
  };

  const register = async (payload) => {
    const session = await registerUser(payload);
    syncSession(session);
    return session;
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setToken("");
  };

  const refreshProfile = async () => {
    const profile = await getCurrentUser();
    setUser(profile);
    return profile;
  };

  const updateProfile = async (payload) => {
    const profile = await updateCurrentUser(payload);
    setUser(profile);
    return profile;
  };

  const requestReset = async (payload) => requestPasswordReset(payload);
  const confirmResetCode = async (payload) => verifyResetCode(payload);
  const completeReset = async (payload) => resetPassword(payload);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      requestReset,
      confirmResetCode,
      completeReset,
    }),
    [user, token, initializing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
