"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from '../lib/auth-client';
import {
  FiTool,
  FiMail,
  FiLock,
  FiArrowRight,
} from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const { data, error: authError } =
        await authClient.signIn.email({
          email: email.trim(),
          password,
        });

      if (authError) {
        setError(authError.message || "Invalid email or password.");
        return;
      }

      if (data) {
        const { data: sessionData, error: sessionError } =
          await authClient.getSession();

        if (sessionError || !sessionData?.user) {
          setError("Login successful, but unable to load your account.");
          return;
        }

        const role = sessionData.user.role;

        if (role === "admin") {
          router.push("/admin/dashboard");
        } else if (role === "technician") {
          router.push("/technician/dashboard");
        } else {
          router.push("/dashboard");
        }

        router.refresh();
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-5 py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/70 md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden flex-col justify-between bg-gradient-to-br from-blue-700 to-indigo-800 p-12 text-white md:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 text-2xl">
                <FiTool />
              </div>

              <h2 className="text-3xl font-extrabold">
                FixMate
              </h2>
            </div>

            <h1 className="mt-20 text-4xl font-extrabold leading-tight">
              Welcome Back!
              <br />
              Let's Get Things Fixed.
            </h1>

            <p className="mt-6 leading-8 text-blue-100">
              Sign in to manage your repair bookings, connect with
              professional technicians and enjoy a hassle-free experience.
            </p>
          </div>

          <p className="text-sm text-blue-200">
            Your trusted repair service platform.
          </p>
        </div>

        {/* Login Form */}
        <div className="flex flex-col justify-center p-7 sm:p-10 md:p-12">
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600 md:hidden">
              <FiTool />
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Email Address
              </label>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Password
              </label>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Login to Account"}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-blue-600 transition hover:text-blue-700"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
