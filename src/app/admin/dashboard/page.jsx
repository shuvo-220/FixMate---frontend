"use client";

import { useEffect, useState } from "react";
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
  FiCheck,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

import ProtectedRoute from "../../components/ProtectedRoute";
import { authClient } from "../../lib/auth-client";
import api from "../../lib/axios";
import { toast } from "sonner";

const menuItems = [
  { name: "Overview", icon: FiGrid },
  { name: "Manage Users", icon: FiUsers },
  { name: "Manage Services", icon: FiTool },
  { name: "Pending Services", icon: FiClock },
  { name: "All Bookings", icon: FiCalendar },
  { name: "Payments", icon: FiCreditCard },
];

// ==================== OVERVIEW ====================

function Overview({ setActiveMenu }) {
  const stats = [
    { title: "Total Users", value: "--", icon: FiUsers, color: "bg-blue-100 text-blue-600" },
    { title: "Total Services", value: "--", icon: FiTool, color: "bg-purple-100 text-purple-600" },
    { title: "Pending Services", value: "--", icon: FiClock, color: "bg-orange-100 text-orange-600" },
    { title: "Total Bookings", value: "--", icon: FiCalendar, color: "bg-green-100 text-green-600" },
  ];

  return (
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

// ==================== MANAGE USERS ====================

function ManageUsers() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Manage Users
      </h1>

      <p className="mt-2 text-slate-500">
        View registered users and manage customer and technician roles.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <FiUsers className="mx-auto text-4xl text-slate-400" />

        <p className="mt-3 text-sm text-slate-500">
          Manage Users feature will be connected next.
        </p>
      </div>
    </div>
  );
}

// ==================== MANAGE SERVICES ====================

function ManageServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        "Unable to verify your admin session. Please login again."
      );
    }

    return data.token;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get("/api/admin/services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: search || undefined,
          approvalStatus: status || undefined,
          category: category || undefined,
        },
      });

      setServices(response.data.services || []);
    } catch (error) {
      console.error("Manage Services Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load services!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, status, category]);

  const getStatusStyle = (value) => {
    if (value === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (value === "pending") {
      return "bg-orange-100 text-orange-700";
    }

    if (value === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Manage Services
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage all services listed by technicians.
          </p>
        </div>

        <button
          onClick={fetchServices}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Search and Filters */}

      <div className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 md:grid-cols-3">
        <input
          type="text"
          placeholder="Search service or technician..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Smartphone">Smartphone</option>
          <option value="Laptop & PC">Laptop & PC</option>
          <option value="AC">AC</option>
          <option value="Refrigerator">Refrigerator</option>
          <option value="TV">TV</option>
          <option value="Washing Machine">Washing Machine</option>
          <option value="Electrical">Electrical</option>
        </select>
      </div>

      {/* Service Count */}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">
          All Services
        </p>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
          {services.length} Services
        </span>
      </div>

      {/* Service List */}

      <div className="mt-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>

            <p className="mt-3 text-sm text-slate-500">
              Loading services...
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <FiTool className="mx-auto text-5xl text-slate-300" />

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No Services Found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              No services match your search or selected filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 xl:grid-cols-2">
            {services.map((service) => (
              <div
                key={service._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="grid sm:grid-cols-[150px_1fr]">
                  <div className="min-h-40 bg-slate-100">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full min-h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full min-h-40 items-center justify-center text-slate-400">
                        <FiTool size={36} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="text-lg font-bold text-slate-900">
                        {service.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                          service.approvalStatus
                        )}`}
                      >
                        {service.approvalStatus}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      {service.category}
                    </p>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400">Base Price</p>
                        <p className="font-bold text-blue-600">
                          ৳
                          {Number(
                            service.basePrice || 0
                          ).toLocaleString()}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">Duration</p>
                        <p className="font-semibold text-slate-800">
                          {service.estimatedDuration}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">Technician</p>
                        <p className="break-words font-semibold text-slate-800">
                          {service.technicianName}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400">Service Area</p>
                        <p className="font-semibold text-slate-800">
                          {service.serviceArea}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                      <span
                        className={`text-xs font-bold ${
                          service.isAvailable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {service.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </span>

                      <span className="text-xs text-slate-500">
                        {service.serviceMode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== PENDING SERVICES ====================

function PendingServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [rejectService, setRejectService] = useState(null);

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        "Unable to verify your admin session. Please login again."
      );
    }

    return data.token;
  };

  const fetchPendingServices = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get("/api/admin/pending-services", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const pendingServices =
        response.data.services ||
        response.data.pendingServices ||
        [];

      setServices(pendingServices);
    } catch (error) {
      console.error("Pending Services Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load pending services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingServices();
  }, []);

  const handleApprove = async (serviceId) => {
    try {
      setActionId(serviceId);

      const token = await getToken();

      const response = await api.patch(
        `/api/admin/services/${serviceId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data.message || "Service approved successfully!"
      );

      setServices((previous) =>
        previous.filter((service) => service._id !== serviceId)
      );
    } catch (error) {
      console.error("Approve Service Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to approve service."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectService) return;

    const serviceId = rejectService._id;

    try {
      setActionId(serviceId);

      const token = await getToken();

      const response = await api.patch(
        `/api/admin/services/${serviceId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data.message || "Service rejected successfully!"
      );

      setServices((previous) =>
        previous.filter((service) => service._id !== serviceId)
      );

      setRejectService(null);
    } catch (error) {
      console.error("Reject Service Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to reject service."
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Pending Services
          </h1>

          <p className="mt-2 text-slate-500">
            Review technician submissions awaiting approval.
          </p>
        </div>

        <button
          onClick={fetchPendingServices}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <div>
            <h2 className="font-bold text-slate-900">
              Approval Requests
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review and approve or reject technician services.
            </p>
          </div>

          <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700">
            {services.length} Pending
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>

            <p className="mt-3 text-sm text-slate-500">
              Loading pending services...
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center">
            <FiCheck className="mx-auto text-5xl text-green-500" />

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No Pending Services
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              All submitted services have been reviewed.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {services.map((service) => (
              <div
                key={service._id}
                className="grid gap-5 p-5 md:grid-cols-[180px_1fr] md:p-6"
              >
                <div className="overflow-hidden rounded-xl bg-slate-100">
                  {service.image ? (
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-48 w-full object-cover md:h-full md:min-h-44"
                    />
                  ) : (
                    <div className="flex h-48 items-center justify-center text-slate-400">
                      <FiTool size={40} />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold capitalize text-orange-700">
                        {service.approvalStatus || "pending"}
                      </span>

                      <h3 className="mt-3 text-xl font-bold text-slate-900">
                        {service.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        {service.category}
                      </p>
                    </div>

                    <p className="text-xl font-extrabold text-blue-600">
                      ৳
                      {Number(
                        service.basePrice || 0
                      ).toLocaleString()}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      <strong className="text-slate-800">
                        Technician:
                      </strong>{" "}
                      {service.technicianName}
                    </p>

                    <p className="break-all">
                      <strong className="text-slate-800">
                        Email:
                      </strong>{" "}
                      {service.technicianEmail}
                    </p>

                    <p>
                      <strong className="text-slate-800">
                        Duration:
                      </strong>{" "}
                      {service.estimatedDuration}
                    </p>

                    <p>
                      <strong className="text-slate-800">
                        Service Mode:
                      </strong>{" "}
                      {service.serviceMode}
                    </p>

                    <p className="sm:col-span-2">
                      <strong className="text-slate-800">
                        Service Area:
                      </strong>{" "}
                      {service.serviceArea}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleApprove(service._id)}
                      disabled={actionId !== null}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FiCheck />

                      {actionId === service._id
                        ? "Processing..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() => setRejectService(service)}
                      disabled={actionId !== null}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      <FiXCircle />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Confirmation Modal */}

      {rejectService && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <FiXCircle size={24} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Reject this service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to reject "{rejectService.title}"?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setRejectService(null)}
                disabled={actionId !== null}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={actionId !== null}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {actionId === rejectService._id
                  ? "Rejecting..."
                  : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== ALL BOOKINGS ====================

function AllBookings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        All Bookings
      </h1>

      <p className="mt-2 text-slate-500">
        Monitor all repair service bookings across FixMate.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <FiCalendar className="mx-auto text-4xl text-slate-400" />

        <p className="mt-3 text-sm text-slate-500">
          Connect the admin bookings API to display records.
        </p>
      </div>
    </div>
  );
}

// ==================== PAYMENTS ====================

function Payments() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Payments
      </h1>

      <p className="mt-2 text-slate-500">
        Monitor payment transactions made through FixMate.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <FiCreditCard className="mx-auto text-4xl text-slate-400" />

        <p className="mt-3 text-sm text-slate-500">
          Connect the payments API to display transactions.
        </p>
      </div>
    </div>
  );
}

// ==================== ADMIN DASHBOARD ====================

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
            {sidebarOpen ? (
              <FiX size={23} />
            ) : (
              <FiMenu size={23} />
            )}
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

        {/* Sidebar */}

        <aside
          className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
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

        {/* Main Content */}

        <main className="min-h-screen lg:ml-72">
          <header className="hidden h-[76px] items-center justify-between border-b border-slate-200 bg-white px-8 lg:flex">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Admin Workspace
              </p>

              <h2 className="font-bold text-slate-800">
                {activeMenu}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <FiShield size={19} />
            </div>
          </header>

          <section className="p-5 md:p-8 lg:p-10">
            <div className="mx-auto max-w-7xl">
              {renderContent()}
            </div>
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
