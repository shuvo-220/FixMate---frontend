"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

import { authClient } from "../app/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isLoggingOutRef = useRef(false);

  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  const user = session?.user || null;

  const isLogoutInProgress = useCallback(() => {
    return isLoggingOutRef.current;
  }, []);


  useEffect(() => {
    if (user) {
      isLoggingOutRef.current = false;
      setIsLoggingOut(false);
    }
  }, [user?.id]);

  const logout = async () => {
    if (isLoggingOutRef.current) return;

    isLoggingOutRef.current = true;
    setIsLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message || "Logout failed!");
      }

      window.location.assign("/login");

    } catch (error) {
      isLoggingOutRef.current = false;
      setIsLoggingOut(false);

      throw error;
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading: isPending,
    isLoggingOut,
    isLogoutInProgress,
    error,
    logout,
    refetchSession: refetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
