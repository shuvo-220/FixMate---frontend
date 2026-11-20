"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiGrid,
  FiCalendar,
  FiCreditCard,
  FiUser,
  FiTool,
  FiMenu,
  FiX,
  FiLogOut,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

import ProtectedRoute from "../components/ProtectedRoute";

const menuItems = [
  { name: "Dashboard", icon: FiGrid },
  { name: "My Bookings", icon: FiCalendar },
  { name: "Payment History", icon: FiCreditCard },
  { name: "My Profile", icon: FiUser },
];

function Overview({ setActiveMenu }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Welcome to FixMate!
        </h1>
        <p className="mt-2 text-slate-500">
          Manage your repair services and account from here.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiCalendar size={23} />
          </div>
          <p className="text-sm text-slate-500">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">--</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <FiCheckCircle size={23} />
          </div>
          <p className="text-sm text-slate-500">Completed Services</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">--</h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
            <FiClock size={23} />
          </div>
          <p className="text-sm text-slate-500">Pending Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">--</h2>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-slate-900 p-7 text-white md:p-9">
        <h2 className="text-2xl font-bold">Need a repair service?</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
          Find trusted technicians and book reliable repair services for your
          devices and home appliances.
        </p>

        <Link
          href="/services"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Browse Services <FiArrowRight />
        </Link>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Bookings
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your latest repair service requests.
            </p>
          </div>

          <button
            onClick={() => setActiveMenu("My Bookings")}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
          <FiCalendar className="mx-auto text-3xl text-slate-400" />
          <p className="mt-3 text-sm text-slate-500">
            Your booking information will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

function Bookings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        My Bookings
      </h1>

      <p className="mt-2 text-slate-500">
        Track and manage your repair service requests.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <FiCalendar className="mx-auto text-4xl text-slate-400" />

        <h2 className="mt-4 font-semibold text-slate-800">
          No booking information yet
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your bookings will appear here after connecting the API.
        </p>

        <Link
          href="/services"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Browse Services <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}

function Payments() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Payment History
      </h1>

      <p className="mt-2 text-slate-500">
        View your previous payments and transactions.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <FiCreditCard className="mx-auto text-4xl text-slate-400" />

        <h2 className="mt-4 font-semibold text-slate-800">
          No payment records yet
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your payment history will appear here after connecting the API.
        </p>
      </div>
    </div>
  );
}

function Profile() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        My Profile
      </h1>

      <p className="mt-2 text-slate-500">
        View and manage your personal information.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <FiUser size={30} />
        </div>

        <h2 className="mt-5 text-lg font-bold text-slate-900">
          Account Information
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your name, email, phone number, area and profile image will appear
          here after connecting the profile API.
        </p>
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case "My Bookings":
        return <Bookings />;

      case "Payment History":
        return <Payments />;

      case "My Profile":
        return <Profile />;

      default:
        return <Overview setActiveMenu={setActiveMenu} />;
    }
  };

  return (
    <ProtectedRoute allowedRole="customer">
      <div className="min-h-screen bg-slate-50">
        {/* Mobile Header */}
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 lg:hidden">
          <Link href="/" className="text-xl font-bold text-slate-900">
            Fix<span className="text-blue-600">Mate</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FiX size={23} /> : <FiMenu size={23} />}
          </button>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            aria-label="Close sidebar"
          />
        )}

        {/* Fixed Sidebar */}
        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="border-b border-slate-100 px-7 py-7">
            <Link href="/" className="text-2xl font-bold text-slate-900">
              Fix<span className="text-blue-600">Mate</span>
            </Link>

            <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              Customer Panel
            </p>
          </div>

          <div className="flex-1 px-4 py-7">
            <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setActiveMenu(item.name);
                      setSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                    }`}
                  >
                    <Icon size={19} />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            <div className="mt-8 border-t border-slate-100 pt-7">
              <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quick Access
              </p>

              <Link
                href="/services"
                className="flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
              >
                <FiTool size={19} />
                Browse Services
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 p-4">
            <Link
              href="/"
              className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <FiLogOut size={19} />
              Back to Home
            </Link>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="min-h-screen lg:ml-72">
          <header className="hidden h-[76px] items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Customer Workspace
              </p>

              <h2 className="font-bold text-slate-800">{activeMenu}</h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FiUser size={19} />
            </div>
          </header>

          <section className="p-5 md:p-8 lg:p-10">
            <div className="mx-auto max-w-7xl">{renderContent()}</div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
