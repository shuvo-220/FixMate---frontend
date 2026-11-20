"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FiGrid,
  FiTool,
  FiPlusCircle,
  FiCalendar,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiBriefcase,
} from "react-icons/fi";

import ProtectedRoute from "../../components/ProtectedRoute";

const menuItems = [
  { name: "Dashboard", icon: FiGrid },
  { name: "My Services", icon: FiTool },
  { name: "Add New Service", icon: FiPlusCircle },
  { name: "My Bookings", icon: FiCalendar },
  { name: "My Profile", icon: FiUser },
];

function Overview({ setActiveMenu }) {
  const stats = [
    {
      title: "Total Services",
      value: "--",
      icon: FiTool,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Bookings",
      value: "--",
      icon: FiCalendar,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Completed Jobs",
      value: "--",
      icon: FiCheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Jobs",
      value: "--",
      icon: FiClock,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Technician Dashboard
      </h1>

      <p className="mt-2 text-slate-500">
        Manage your repair services, customer bookings and work progress.
      </p>

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

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-900 p-7 text-white">
          <h2 className="text-xl font-bold">Grow Your Repair Business</h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Add your repair services and reach more customers through FixMate.
          </p>

          <button
            onClick={() => setActiveMenu("Add New Service")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-700"
          >
            Add New Service <FiArrowRight />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="text-xl font-bold text-slate-900">
            Manage Your Work
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Check your bookings and keep track of customer repair requests.
          </p>

          <button
            onClick={() => setActiveMenu("My Bookings")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View Bookings <FiArrowRight />
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">Recent Bookings</h2>

        <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
          <FiCalendar className="mx-auto text-3xl text-slate-400" />

          <p className="mt-3 text-sm text-slate-500">
            Your recent booking information will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

function MyServices({ setActiveMenu }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            My Services
          </h1>

          <p className="mt-2 text-slate-500">
            Manage the repair services you offer.
          </p>
        </div>

        <button
          onClick={() => setActiveMenu("Add New Service")}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <FiPlusCircle /> Add Service
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <FiTool className="mx-auto text-4xl text-slate-400" />

        <h2 className="mt-4 font-semibold text-slate-800">
          Your services will appear here
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Connect the services API to load and manage your services.
        </p>
      </div>
    </div>
  );
}

function AddService() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Add New Service
      </h1>

      <p className="mt-2 text-slate-500">
        Create a new repair service listing.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex items-center gap-3 text-blue-600">
          <FiPlusCircle size={25} />

          <h2 className="text-lg font-bold text-slate-900">
            Create Service
          </h2>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          The service creation form will be connected to the backend API in the
          next step.
        </p>
      </div>
    </div>
  );
}

function MyBookings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        My Bookings
      </h1>

      <p className="mt-2 text-slate-500">
        Manage customer repair requests and job status.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <FiCalendar className="mx-auto text-4xl text-slate-400" />

        <h2 className="mt-4 font-semibold text-slate-800">
          No booking information loaded
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Customer bookings will appear here after connecting the API.
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
        Manage your technician account information.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <FiUser size={30} />
        </div>

        <h2 className="mt-5 text-lg font-bold text-slate-900">
          Technician Information
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Your name, email, phone, area and profile details will appear here
          after API integration.
        </p>
      </div>
    </div>
  );
}

export default function TechnicianDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case "My Services":
        return <MyServices setActiveMenu={setActiveMenu} />;

      case "Add New Service":
        return <AddService />;

      case "My Bookings":
        return <MyBookings />;

      case "My Profile":
        return <Profile />;

      default:
        return <Overview setActiveMenu={setActiveMenu} />;
    }
  };

  return (
    <ProtectedRoute allowedRole="technician">
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
              Technician Panel
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-7">
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
                Technician Workspace
              </p>

              <h2 className="font-bold text-slate-800">{activeMenu}</h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FiBriefcase size={19} />
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
