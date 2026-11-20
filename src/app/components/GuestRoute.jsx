"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";

export default function GuestRoute({ children }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && user?.role === "admin") {
      router.replace("/admin/dashboard");
    } else if (isAuthenticated && user?.role === "technician") {
      router.replace("/technician/dashboard");
    } else if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return children;
}
