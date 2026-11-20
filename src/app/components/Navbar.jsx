"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
  FiTool,
  FiMenu,
  FiX,
  FiArrowRight,
  FiUser,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/authContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      closeMenu();

      await logout();

      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error(
        error.message || "Unable to logout. Please try again."
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userName = user?.name || "My Account";

  const dashboardLink =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "technician"
      ? "/technician/dashboard"
      : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg shadow-blue-200">
            <FiTool />
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Fix<span className="text-blue-600">Mate</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <Link href="/" className="text-blue-600 transition hover:text-blue-700">
            Home
          </Link>

          <Link href="/services" className="transition hover:text-blue-600">
            Services
          </Link>

          <Link href="/#how-it-works" className="transition hover:text-blue-600">
            How It Works
          </Link>

          <Link href="/#why-fixmate" className="transition hover:text-blue-600">
            Why FixMate
          </Link>
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">
          {!isLoading && isAuthenticated ? (
            <>
              <Link
                href={dashboardLink}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <FiUser size={18} />
                </span>

                <span className="max-w-32 truncate">{userName}</span>
              </Link>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
              >
                <FiLogOut />
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : !isLoading ? (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Get Started
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-slate-800 transition hover:bg-slate-100 md:hidden"
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t border-slate-100 bg-white px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-1">

            <Link
              href="/"
              onClick={closeMenu}
              className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-bold text-blue-600"
            >
              Home
            </Link>

            <Link
              href="/services"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
            >
              Services
            </Link>

            <Link
              href="/#how-it-works"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
            >
              How It Works
            </Link>

            <Link
              href="/#why-fixmate"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-600"
            >
              Why FixMate
            </Link>

            <div className="my-3 border-t border-slate-100" />

            {!isLoading && isAuthenticated ? (
              <>
                <Link
                  href={dashboardLink}
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 font-bold text-blue-700"
                >
                  <FiUser size={19} />
                  <span className="truncate">{userName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                >
                  <FiLogOut />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : !isLoading ? (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                >
                  Get Started <FiArrowRight />
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
