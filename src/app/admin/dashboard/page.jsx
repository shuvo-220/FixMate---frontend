"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiGrid,
  FiUsers,
  FiTool,
  FiClock,
  FiCalendar,
  FiCreditCard,
  FiMenu,
  FiX,
  FiLogOut,
  FiArrowRight,
  FiShield,
  FiActivity,
} from "react-icons/fi";

import ProtectedRoute from "../../components/ProtectedRoute";

const menuItems = [
  { name: "Overview", icon: FiGrid },
  { name: "Manage Users", icon: FiUsers },
  { name: "Manage Services", icon: FiTool },
  { name: "Pending Services", icon: FiClock },
  { name: "All Bookings", icon: FiCalendar },
  { name: "Payments", icon: FiCreditCard },
];

function Overview({ setActiveMenu }) {
  const stats = [
    { title: "Total Users", value: "--", icon: FiUsers, color: "bg-blue-100 text-blue-600" },
    { title: "Total Services", value: "--", icon: FiTool, color: "bg-purple-100 text-purple-600" },
    { title: "Pending Services", value: "--", icon: FiClock, color: "bg-orange-100 text-orange-600" },
    { title: "Total Bookings", value: "--", icon: FiCalendar, color: "bg-green-100 text-green-600" },
  ];

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          Administration
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor and manage the entire FixMate platform.
        </p>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
              >
                <Icon size={23} />
              </div>

              <p className="text-sm text-slate-500">{stat.title}</p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl bg-slate-900 p-7 text-white md:p-9">
        <div className="flex items-center gap-3">
          <FiShield className="text-3xl text-blue-400" />
          <h2 className="text-xl font-bold">Platform Administration</h2>
        </div>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Manage users, review technician services, monitor bookings and
          track payments from one central dashboard.
        </p>

        <button
          onClick={() => setActiveMenu("Pending Services")}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
        >
          Review Pending Services <FiArrowRight />
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <FiUsers className="text-xl text-blue-600" />
            <h2 className="font-bold text-slate-900">User Management</h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            View registered customers and technicians and manage their roles.
          </p>

          <button
            onClick={() => setActiveMenu("Manage Users")}
            className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Manage Users →
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <FiActivity className="text-xl text-green-600" />
            <h2 className="font-bold text-slate-900">Booking Management</h2>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Monitor customer bookings and service progress across the platform.
          </p>

          <button
            onClick={() => setActiveMenu("All Bookings")}
            className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View Bookings →
          </button>
        </div>
      </div>
    </div>
  );
}

function ManageUsers() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Manage Users
      </h1>

      <p className="mt-2 text-slate-500">
        View registered users and manage customer and technician roles.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold text-slate-900">All Registered Users</h2>

          <p className="mt-1 text-sm text-slate-500">
            User information will load from the admin API.
          </p>
        </div>

        <div className="p-10 text-center">
          <FiUsers className="mx-auto text-4xl text-slate-400" />

          <p className="mt-3 text-sm text-slate-500">
            Connect the users API to display user records.
          </p>
        </div>
      </div>
    </div>
  );
}

function ManageServices() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Manage Services
      </h1>

      <p className="mt-2 text-slate-500">
        Review and manage services listed by technicians.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold text-slate-900">All Services</h2>

          <p className="mt-1 text-sm text-slate-500">
            Service records will load from the admin API.
          </p>
        </div>

        <div className="p-10 text-center">
          <FiTool className="mx-auto text-4xl text-slate-400" />

          <p className="mt-3 text-sm text-slate-500">
            Connect the services API to display all services.
          </p>
        </div>
      </div>
    </div>
  );
}

function PendingServices() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Pending Services
      </h1>

      <p className="mt-2 text-slate-500">
        Review technician submissions awaiting approval.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold text-slate-900">Approval Requests</h2>

          <p className="mt-1 text-sm text-slate-500">
            Pending service requests will load here.
          </p>
        </div>

        <div className="p-10 text-center">
          <FiClock className="mx-auto text-4xl text-orange-400" />

          <p className="mt-3 text-sm text-slate-500">
            Connect the pending services API to review submissions.
          </p>
        </div>
      </div>
    </div>
  );
}

function AllBookings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        All Bookings
      </h1>

      <p className="mt-2 text-slate-500">
        Monitor all repair service bookings across FixMate.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold text-slate-900">Booking Records</h2>

          <p className="mt-1 text-sm text-slate-500">
            All booking records will load here.
          </p>
        </div>

        <div className="p-10 text-center">
          <FiCalendar className="mx-auto text-4xl text-slate-400" />

          <p className="mt-3 text-sm text-slate-500">
            Connect the admin bookings API to display records.
          </p>
        </div>
      </div>
    </div>
  );
}

function Payments() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Payments
      </h1>

      <p className="mt-2 text-slate-500">
        Monitor payment transactions made through FixMate.
      </p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-6">
          <h2 className="font-bold text-slate-900">All Transactions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Payment records will load from the admin API.
          </p>
        </div>

        <div className="p-10 text-center">
          <FiCreditCard className="mx-auto text-4xl text-slate-400" />

          <p className="mt-3 text-sm text-slate-500">
            Connect the payments API to display transactions.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case "Manage Users":
        return <ManageUsers />;

      case "Manage Services":
        return <ManageServices />;

      case "Pending Services":
        return <PendingServices />;

      case "All Bookings":
        return <AllBookings />;

      case "Payments":
        return <Payments />;

      default:
        return <Overview setActiveMenu={setActiveMenu} />;
    }
  };

  return (
    <ProtectedRoute allowedRole="admin">
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
              Admin Panel
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-7">
            <p className="mb-4 px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Management
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

        {/* Right Content */}
        <main className="min-h-screen lg:ml-72">
          <header className="hidden h-[76px] items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Admin Workspace
              </p>

              <h2 className="font-bold text-slate-800">{activeMenu}</h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FiShield size={19} />
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
