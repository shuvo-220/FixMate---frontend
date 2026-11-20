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

//OVERVIEW 
function Overview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    pendingServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found!");
    }

    return data.token;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        usersResponse,
        servicesResponse,
        bookingsResponse,
        paymentsResponse,
      ] = await Promise.all([
        api.get("/api/admin/users", config),
        api.get("/api/admin/services", config),
        api.get("/api/admin/bookings", config),
        api.get("/api/admin/payments", config),
      ]);

      const users = usersResponse.data.users || [];
      const services = servicesResponse.data.services || [];
      const bookings = bookingsResponse.data.bookings || [];
      const payments = paymentsResponse.data.payments || [];

      const pendingCount = services.filter(
        (service) => service.approvalStatus === "pending"
      ).length;

      const revenue = payments
        .filter((payment) => payment.paymentStatus === "paid")
        .reduce(
          (total, payment) => total + Number(payment.amount || 0),
          0
        );

      setStats({
        totalUsers: users.length,
        totalServices: services.length,
        pendingServices: pendingCount,
        totalBookings: bookings.length,
        totalRevenue: revenue,
      });

      setRecentBookings(
        [...bookings]
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0) -
              new Date(a.createdAt || 0)
          )
          .slice(0, 5)
      );

      setRecentPayments(
        [...payments]
          .sort(
            (a, b) =>
              new Date(b.paidAt || b.createdAt || 0) -
              new Date(a.paidAt || a.createdAt || 0)
          )
          .slice(0, 5)
      );
    } catch (error) {
      console.error("Admin Dashboard Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load dashboard data!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: "👥",
    },
    {
      title: "Total Services",
      value: stats.totalServices,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      icon: "🛠️",
    },
    {
      title: "Pending Services",
      value: stats.pendingServices,
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: "⏳",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      color: "text-purple-600",
      bg: "bg-purple-50",
      icon: "📅",
    },
    {
      title: "Total Revenue",
      value: `৳${stats.totalRevenue.toLocaleString("en-US")}`,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: "💰",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Admin Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor your FixMate platform from one place.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Dashboard"}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <h2 className={`mt-3 text-2xl font-bold ${card.color}`}>
                  {loading ? "..." : card.value}
                </h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${card.bg}`}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-bold text-slate-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest service booking activities
            </p>
          </div>
        </div>

        {loading ? (
          <p className="p-8 text-center text-sm text-slate-500">
            Loading bookings...
          </p>
        ) : recentBookings.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No bookings available.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentBookings.map((booking) => (
              <div
                key={booking._id || booking.id}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {booking.serviceTitle ||
                      booking.serviceName ||
                      booking.service?.title ||
                      "Service Booking"}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {booking.customerName ||
                      booking.customer?.name ||
                      booking.customerEmail ||
                      "Customer"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {formatDate(booking.createdAt)}
                  </span>

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                    {booking.status || "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Payments */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold text-slate-900">
            Recent Payments
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Latest transaction records
          </p>
        </div>

        {loading ? (
          <p className="p-8 text-center text-sm text-slate-500">
            Loading payments...
          </p>
        ) : recentPayments.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No payments available.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentPayments.map((payment) => (
              <div
                key={payment._id || payment.transactionId}
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {payment.customerName ||
                      payment.customerEmail ||
                      "Customer"}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {payment.transactionId || "Transaction ID unavailable"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-emerald-600">
                    {payment.amount != null
                      ? `${payment.currency || "USD"} ${Number(
                          payment.amount
                        ).toLocaleString("en-US")}`
                      : "N/A"}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      payment.paymentStatus === "paid"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {payment.paymentStatus || "Unknown"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// MANAGE USERS 
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found!");
    }

    return data.token;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load users!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);

      const token = await getToken();

      const response = await api.patch(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data.message || "User role updated!");

      await fetchUsers();
    } catch (error) {
      console.error("Update Role Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update user role!"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Manage Users
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View registered users and manage customer and technician roles.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Users"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Users</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {users.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Customers</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {users.filter((user) => user.role === "customer").length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Technicians</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {users.filter((user) => user.role === "technician").length}
          </h2>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 md:flex-1"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="technician">Technicians</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold text-slate-900">
            All Registered Users
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading users...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <h3 className="font-semibold text-slate-700">
              No users found
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or role filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map((user) => {
              const userId = user.id || user._id;

              return (
                <div
                  key={userId}
                  className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between"
                >
                  {/* User Information */}
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        user.name?.charAt(0)?.toUpperCase() || "U"
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">
                        {user.name || "Unnamed User"}
                      </h3>

                      <p className="truncate text-sm text-slate-500">
                        {user.email}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {user.phone || "No phone number"}
                      </p>
                    </div>
                  </div>

                  {/* Role and Action */}
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                        user.role === "technician"
                          ? "bg-emerald-100 text-emerald-700"
                          : user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {user.role || "customer"}
                    </span>

                    {user.role === "admin" ? (
                      <span className="text-xs font-medium text-slate-400">
                        Admin Account
                      </span>
                    ) : (
                      <select
                        value={user.role || "customer"}
                        disabled={updatingId === userId}
                        onChange={(e) =>
                          handleRoleChange(userId, e.target.value)
                        }
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                      </select>
                    )}

                    {updatingId === userId && (
                      <span className="text-xs text-blue-600">
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


//  MANAGE SERVICES
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

//  PENDING SERVICES 
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

//  ALL BOOKINGS 
function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found!");
    }

    return data.token;
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get("/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error("Fetch Bookings Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load bookings!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      requested: "bg-blue-100 text-blue-700",
      accepted: "bg-indigo-100 text-indigo-700",
      "in progress": "bg-amber-100 text-amber-700",
      completed: "bg-emerald-100 text-emerald-700",
      rejected: "bg-red-100 text-red-700",
      cancelled: "bg-slate-100 text-slate-600",
    };

    return (
      styles[status?.toLowerCase()] ||
      "bg-slate-100 text-slate-600"
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const customer =
      booking.customerName ||
      booking.customer?.name ||
      "";

    const technician =
      booking.technicianName ||
      booking.technician?.name ||
      "";

    const service =
      booking.serviceTitle ||
      booking.serviceName ||
      booking.service?.title ||
      "";

    const searchText = [
      customer,
      technician,
      service,
      booking.customerEmail,
      booking.technicianEmail,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      booking.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status.replace(/([A-Z])/g, " $1");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            All Bookings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor and manage all platform service bookings.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Bookings"}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Bookings</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Requested</p>
          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            {bookings.filter(
              (b) => b.status?.toLowerCase() === "requested"
            ).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">In Progress</p>
          <h2 className="mt-2 text-3xl font-bold text-amber-600">
            {bookings.filter(
              (b) => b.status?.toLowerCase() === "in progress"
            ).length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Completed</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {bookings.filter(
              (b) => b.status?.toLowerCase() === "completed"
            ).length}
          </h2>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row">
        <input
          type="text"
          placeholder="Search customer, technician or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 md:flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Booking List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold text-slate-900">
            Booking Records
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-16 text-center">
            <h3 className="font-semibold text-slate-700">
              No bookings found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or status filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredBookings.map((booking) => {
              const bookingId = booking._id || booking.id;

              const customer =
                booking.customerName ||
                booking.customer?.name ||
                booking.customerEmail ||
                "N/A";

              const technician =
                booking.technicianName ||
                booking.technician?.name ||
                booking.technicianEmail ||
                "N/A";

              const service =
                booking.serviceTitle ||
                booking.serviceName ||
                booking.service?.title ||
                "N/A";

              const amount =
                booking.finalAmount ??
                booking.amount ??
                booking.totalAmount;

              const status = booking.status || "Unknown";

              return (
                <div
                  key={bookingId}
                  className="space-y-4 p-5 transition hover:bg-slate-50"
                >
                  {/* Top Row */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Booking ID
                      </p>

                      <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                        {bookingId || "N/A"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                          status
                        )}`}
                      >
                        {formatStatus(status)}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          booking.paymentStatus === "paid" ||
                          booking.isPaid === true
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {booking.paymentStatus ||
                          (booking.isPaid ? "Paid" : "Unpaid")}
                      </span>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-xs text-slate-400">Service</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {service}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Customer</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {customer}
                      </p>
                      <p className="text-xs text-slate-500">
                        {booking.customerEmail ||
                          booking.customer?.email ||
                          ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Technician</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {technician}
                      </p>
                      <p className="text-xs text-slate-500">
                        {booking.technicianEmail ||
                          booking.technician?.email ||
                          ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Booking Date</p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {formatDate(
                          booking.bookingDate ||
                            booking.createdAt ||
                            booking.date
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <div>
                      <p className="text-xs text-slate-400">Final Amount</p>
                      <p className="mt-1 text-lg font-bold text-blue-600">
                        {amount !== undefined && amount !== null
                          ? `৳${Number(amount).toLocaleString()}`
                          : "Not finalized"}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400">
                      Created: {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


//  PAYMENTS 
function Payments() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found!");
    }

    return data.token;
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get("/api/admin/payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayments(response.data.payments || []);
    } catch (error) {
      console.error("Fetch Payments Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load payments!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const searchText = [
      payment.transactionId,
      payment.bookingId,
      payment.serviceTitle,
      payment.customerName,
      payment.customerEmail,
      payment.technicianName,
      payment.technicianEmail,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      payment.paymentStatus?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, currency) => {
    const value = Number(amount);

    if (Number.isNaN(value)) return "N/A";

    return `${(currency || "USD").toUpperCase()} ${value.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const totalRevenue = payments
    .filter((payment) => payment.paymentStatus === "paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  const paidCount = payments.filter(
    (payment) => payment.paymentStatus === "paid"
  ).length;

  const getStatusStyle = (status) => {
    if (status?.toLowerCase() === "paid") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status?.toLowerCase() === "pending") {
      return "bg-amber-100 text-amber-700";
    }

    if (status?.toLowerCase() === "failed") {
      return "bg-red-100 text-red-700";
    }

    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Payment Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor all transactions and payment records.
          </p>
        </div>

        <button
          onClick={fetchPayments}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Payments"}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Transactions</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {payments.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Successful Payments</p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-600">
            {paidCount}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total Paid Amount</p>

          <h2 className="mt-2 text-2xl font-bold text-blue-600">
            {totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Sum of paid transaction amounts
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 md:flex-row">
        <input
          type="text"
          placeholder="Search transaction, customer or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 md:flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Payments List */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-bold text-slate-900">
            Transaction History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredPayments.length} of {payments.length} transactions
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading payments...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="py-16 text-center">
            <h3 className="font-semibold text-slate-700">
              No payments found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or payment status filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredPayments.map((payment) => (
              <div
                key={payment._id}
                className="space-y-4 p-5 transition hover:bg-slate-50"
              >
                {/* Transaction Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Transaction ID
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                      {payment.transactionId || "N/A"}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                      payment.paymentStatus
                    )}`}
                  >
                    {payment.paymentStatus || "Unknown"}
                  </span>
                </div>

                {/* Transaction Information */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-slate-400">Service</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {payment.serviceTitle || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Customer</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {payment.customerName || "N/A"}
                    </p>

                    <p className="break-all text-xs text-slate-500">
                      {payment.customerEmail || ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Technician</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {payment.technicianName || "N/A"}
                    </p>

                    <p className="break-all text-xs text-slate-500">
                      {payment.technicianEmail || ""}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Payment Date</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>
                </div>

                {/* Bottom Information */}
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Booking ID</p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {payment.bookingId || "N/A"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-slate-400">Payment Amount</p>

                    <p className="mt-1 text-xl font-bold text-blue-600">
                      {formatAmount(payment.amount, payment.currency)}
                    </p>
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


//  ADMIN DASHBOARD 
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
