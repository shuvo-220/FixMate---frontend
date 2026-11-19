"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiTool,
  FiMenu,
  FiX,
  FiArrowRight,
} from "react-icons/fi";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

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
          <Link
            href="/"
            className="text-blue-600 transition hover:text-blue-700"
          >
            Home
          </Link>

          <Link
            href="/services"
            className="transition hover:text-blue-600"
          >
            Services
          </Link>

          <Link
            href="/#how-it-works"
            className="transition hover:text-blue-600"
          >
            How It Works
          </Link>

          <Link
            href="/#why-fixmate"
            className="transition hover:text-blue-600"
          >
            Why FixMate
          </Link>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
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
          </div>
        </div>
      )}
    </header>
  );
}
