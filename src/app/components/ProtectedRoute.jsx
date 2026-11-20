"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/authContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (allowedRole && user?.role !== allowedRole) {
      if (user?.role === "admin") {
        router.replace("/admin/dashboard");
      } else if (user?.role === "technician") {
        router.replace("/technician/dashboard");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user?.role, allowedRole, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!isAuthenticated || (allowedRole && user?.role !== allowedRole)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return children;
}
