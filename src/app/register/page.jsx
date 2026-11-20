"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "../lib/auth-client";
import GuestRoute from "../components/GuestRoute";
import { toast } from "sonner";

import {
  FiTool,
  FiUser,
  FiMail,
  FiLock,
} from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const showError = (message) => {
    setError(message);
    toast.error(message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, role } = formData;

    if (!name.trim() || !email.trim() || !password) {
      showError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      showError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      showError(
        "Password must contain at least one uppercase and one lowercase letter."
      );
      return;
    }

    if (!["customer", "technician"].includes(role)) {
      showError("Please select a valid role.");
      return;
    }

    try {
      setLoading(true);

      const { data, error: authError } =
        await authClient.signUp.email({
          name: name.trim(),
          email: email.trim(),
          password,
          role,
        });

      if (authError) {
        showError(authError.message || "Registration failed.");
        return;
      }

      if (data) {
        toast.success("Account created successfully! Please login.");

        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      showError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <GuestRoute>
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
                Join FixMate.
                <br />
                Make Repairs Easier.
              </h1>

              <p className="mt-6 leading-8 text-blue-100">
                Connect with trusted technicians or grow your repair
                service business with our platform.
              </p>
            </div>

            <p className="text-sm text-blue-200">
              Your trusted repair service platform.
            </p>
          </div>

          {/* Register Form */}
          <div className="p-7 sm:p-10 md:p-12">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600 md:hidden">
                <FiTool />
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900">
                Create Account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Join FixMate and get started today.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Full Name *
                </label>

                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Email Address *
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
                  Password *
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full rounded-xl border border-slate-200 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Minimum 6 characters, including uppercase and lowercase letters.
                </p>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Register As *
                </label>

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="customer">Customer</option>
                  <option value="technician">Technician</option>
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Login Link */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </GuestRoute>
  );
}
