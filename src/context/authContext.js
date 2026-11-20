"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../app/lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();

  const {
    data: session,
    isPending,
    error,
    refetch,
  } = authClient.useSession();

  const user = session?.user || null;

  const logout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      throw new Error(error.message || "Logout failed!");
    }

    router.replace("/login");
    router.refresh();
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading: isPending,
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
