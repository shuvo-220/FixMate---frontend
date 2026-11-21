"use client";

import { useState, useEffect } from "react";
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
  FiUpload,
  FiImage,
  FiLoader,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiRefreshCw,
  FiPower,
   FiCamera,
  FiSave,
} from "react-icons/fi";


import { toast } from "sonner";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../../context/authContext";
import { authClient } from "../../lib/auth-client";
import api from "../../lib/axios";

const menuItems = [
  { name: "Dashboard", icon: FiGrid },
  { name: "My Services", icon: FiTool },
  { name: "Add New Service", icon: FiPlusCircle },
  { name: "My Bookings", icon: FiCalendar },
  { name: "My Profile", icon: FiUser },
];

const categories = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

const serviceModes = ["Home Visit", "Shop Drop-off"];


function Overview({ setActiveMenu }) {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getAuthToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    return data.token;
  };

  const fetchOverviewData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = await getAuthToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [servicesResponse, bookingsResponse] = await Promise.all([
        api.get("/api/services/my-services", { headers }),
        api.get("/api/bookings/technician-bookings", { headers }),
      ]);

      setServices(servicesResponse.data.services || []);
      setBookings(bookingsResponse.data.bookings || []);
    } catch (error) {
      console.error("Technician Overview Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load dashboard information."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOverviewData();
  }, []);

  // Dashboard statistics
  const totalServices = services.length;

  const approvedServices = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const pendingRequests = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const completedJobs = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  // Latest 5 bookings
  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Services",
      value: totalServices,
      icon: FiTool,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Approved Services",
      value: approvedServices,
      icon: FiCheckCircle,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: FiClock,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Completed Jobs",
      value: completedJobs,
      icon: FiBriefcase,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-blue-100 text-blue-700";

      case "in-progress":
        return "bg-purple-100 text-purple-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "cancelled":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Requested";

    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Technician Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your repair services, customer bookings and work progress.
          </p>
        </div>

        <button
          onClick={() => fetchOverviewData(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
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

      {/* Quick Actions */}
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

      {/* Recent Bookings */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your latest customer repair requests.
            </p>
          </div>

          <button
            onClick={() => setActiveMenu("My Bookings")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            View All <FiArrowRight />
          </button>
        </div>

        {recentBookings.length === 0 ? (
          <div className="mt-6 rounded-xl bg-slate-50 p-8 text-center">
            <FiCalendar className="mx-auto text-3xl text-slate-400" />

            <p className="mt-3 text-sm text-slate-500">
              No bookings yet. Customer booking requests will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  {booking.serviceImage ? (
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle || "Service"}
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <FiTool size={21} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900">
                      {booking.serviceTitle || "Repair Service"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {booking.customerName || "Customer"} ·{" "}
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>

                <span
                  className={`w-fit shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                    booking.status
                  )}`}
                >
                  {formatStatus(booking.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




function MyServices() {
  const { user } = useAuth();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [selectedService, setSelectedService] = useState(null);
  const [editData, setEditData] = useState({});
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteService, setDeleteService] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [updatingAvailability, setUpdatingAvailability] = useState(null);

  const categories = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
  ];

  const getAuthToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    return data.token;
  };

  const getHeaders = async () => {
    const token = await getAuthToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch technician services
  const fetchServices = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const headers = await getHeaders();

      const response = await api.get("/api/services/my-services", {
        headers,
      });

      setServices(response.data.services || []);
    } catch (error) {
      console.error("Fetch Services Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load your services."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Open edit modal
  const openEditModal = (service) => {
    setSelectedService(service);

    setEditData({
      title: service.title || "",
      category: service.category || "",
      description: service.description || "",
      basePrice: service.basePrice || "",
      estimatedDuration: service.estimatedDuration || "",
      serviceMode: service.serviceMode || "Home Visit",
      serviceArea: service.serviceArea || "",
    });

    setEditImage(null);
    setEditImagePreview(service.image || "");
  };

  // Edit input handler
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Image selection
  const handleEditImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setEditImage(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  // Update service
  const handleUpdateService = async (e) => {
    e.preventDefault();

    if (!editData.title.trim()) {
      toast.error("Service title is required.");
      return;
    }

    if (!editData.basePrice || Number(editData.basePrice) <= 0) {
      toast.error("Please enter a valid base price.");
      return;
    }

    try {
      setSaving(true);

      const headers = await getHeaders();

      let imageUrl = selectedService.image;

      // Upload new image if selected
      if (editImage) {
        const reader = new FileReader();

        const base64Image = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Image reading failed."));
          reader.readAsDataURL(editImage);
        });

        const uploadResponse = await api.post(
          "/api/images/upload",
          {
            image: base64Image,
          },
          { headers }
        );

        imageUrl = uploadResponse.data.imageUrl;
      }

      const payload = {
        ...editData,
        basePrice: Number(editData.basePrice),
        image: imageUrl,
      };

      const response = await api.patch(
        `/api/services/${selectedService._id}`,
        payload,
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Service update failed.");
      }

      toast.success("Service updated! Waiting for admin approval.");

      setSelectedService(null);
      setEditImage(null);
      setEditImagePreview("");

      await fetchServices(true);
    } catch (error) {
      console.error("Update Service Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update service."
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete service
  const handleDeleteService = async () => {
    if (!deleteService) return;

    try {
      setDeleting(true);

      const headers = await getHeaders();

      const response = await api.delete(
        `/api/services/${deleteService._id}`,
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Delete failed.");
      }

      toast.success("Service deleted successfully!");

      setDeleteService(null);

      await fetchServices(true);
    } catch (error) {
      console.error("Delete Service Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to delete service."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Availability toggle
  const handleAvailability = async (service) => {
    try {
      setUpdatingAvailability(service._id);

      const headers = await getHeaders();

      const response = await api.patch(
        `/api/services/${service._id}`,
        {
          isAvailable: !service.isAvailable,
        },
        { headers }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update failed.");
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? { ...item, isAvailable: !service.isAvailable }
            : item
        )
      );

      toast.success(
        service.isAvailable
          ? "Service is now unavailable."
          : "Service is now available."
      );
    } catch (error) {
      console.error("Availability Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update service availability."
      );
    } finally {
      setUpdatingAvailability(null);
    }
  };

  // Filter services
  const filteredServices = services.filter((service) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      service.title?.toLowerCase().includes(searchText) ||
      service.category?.toLowerCase().includes(searchText) ||
      service.description?.toLowerCase().includes(searchText) ||
      service.serviceArea?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      service.approvalStatus === statusFilter;

    const matchesCategory =
      categoryFilter === "all" ||
      service.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const pendingCount = services.filter(
    (service) => service.approvalStatus === "pending"
  ).length;

  const approvedCount = services.filter(
    (service) => service.approvalStatus === "approved"
  ).length;

  const rejectedCount = services.filter(
    (service) => service.approvalStatus === "rejected"
  ).length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            My Services
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage, edit and monitor your repair services.
          </p>
        </div>

        <button
          onClick={() => fetchServices(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pending Approval</p>
          <h3 className="mt-2 text-3xl font-bold text-amber-600">
            {pendingCount}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Approved Services</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">
            {approvedCount}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Rejected Services</p>
          <h3 className="mt-2 text-3xl font-bold text-red-600">
            {rejectedCount}
          </h3>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Service List */}
      {filteredServices.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
          <FiTool className="mx-auto text-4xl text-slate-300" />

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            No Services Found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            No services match your current search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="h-48 w-full shrink-0 bg-slate-100 sm:h-auto sm:w-44">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {service.category}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        service.approvalStatus
                      )}`}
                    >
                      {service.approvalStatus}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {service.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Base Price</p>
                      <p className="mt-1 font-bold text-slate-900">
                        ৳{Number(service.basePrice).toLocaleString("en-BD")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Duration</p>
                      <p className="mt-1 font-semibold text-slate-700">
                        {service.estimatedDuration}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Service Mode</p>
                      <p className="mt-1 font-semibold text-slate-700">
                        {service.serviceMode}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Service Area</p>
                      <p className="mt-1 font-semibold text-slate-700">
                        {service.serviceArea}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => handleAvailability(service)}
                      disabled={updatingAvailability === service._id}
                      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition disabled:opacity-60 ${
                        service.isAvailable
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <FiPower />
                      {updatingAvailability === service._id
                        ? "Updating..."
                        : service.isAvailable
                          ? "Available"
                          : "Unavailable"}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(service)}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        <FiEdit2 />
                        Edit
                      </button>

                      <button
                        onClick={() => setDeleteService(service)}
                        className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Service Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-5">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-7">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Edit Service
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Update your service information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedService(null)}
                disabled={saving}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <FiX size={21} />
              </button>
            </div>

            <form
              onSubmit={handleUpdateService}
              className="flex min-h-0 flex-1 flex-col"
            >
              {/* Scrollable Form Content */}
              <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Service Title
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={editData.title || ""}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={editData.category || ""}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={editData.description || ""}
                    onChange={handleEditChange}
                    rows={4}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Base Price (৳)
                    </label>

                    <input
                      type="number"
                      name="basePrice"
                      min="1"
                      value={editData.basePrice ?? ""}
                      onChange={handleEditChange}
                      required
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Estimated Duration
                    </label>

                    <input
                      type="text"
                      name="estimatedDuration"
                      value={editData.estimatedDuration || ""}
                      onChange={handleEditChange}
                      required
                      placeholder="e.g. 2-3 hours"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Service Mode
                  </label>

                  <select
                    name="serviceMode"
                    value={editData.serviceMode || "Home Visit"}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Home Visit">Home Visit</option>
                    <option value="Shop Drop-off">Shop Drop-off</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Service Area
                  </label>

                  <input
                    type="text"
                    name="serviceArea"
                    value={editData.serviceArea || ""}
                    onChange={handleEditChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Service Image
                  </label>

                  <div className="rounded-xl border border-dashed border-slate-300 p-4">
                    {editImagePreview && (
                      <img
                        src={editImagePreview}
                        alt="Service preview"
                        className="mb-4 h-40 w-full rounded-lg object-cover"
                      />
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImage}
                      className="w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                      Select a new image only if you want to replace the current one. Maximum 5MB.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                  <p className="font-semibold">Admin Approval Required</p>
                  <p className="mt-1 text-xs leading-5">
                    Updating service details will send this service back for
                    admin approval.
                  </p>
                </div>
              </div>

              {/* Fixed Modal Footer */}
              <div className="flex shrink-0 justify-end gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <span className="loading loading-spinner loading-xs"></span>
                  )}

                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteService && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <FiTrash2 size={25} />
            </div>

            <h3 className="mt-4 text-center text-xl font-bold text-slate-900">
              Delete Service?
            </h3>

            <p className="mt-2 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteService.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteService(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteService}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function AddService() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "",
    serviceArea: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file!");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.onerror = () => {
      toast.error("Unable to read the selected image!");
      setImageFile(null);
      setImagePreview("");
    };

    reader.readAsDataURL(file);
  };

  const getAuthToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        error?.message || "Authentication token could not be retrieved!"
      );
    }

    return data.token;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      basePrice: "",
      estimatedDuration: "",
      serviceMode: "",
      serviceArea: "",
    });

    setImageFile(null);
    setImagePreview("");

    const fileInput = document.getElementById("service-image");

    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.name || !user?.email) {
      toast.error("Technician information is unavailable. Please login again.");
      return;
    }

    if (!imageFile || !imagePreview) {
      toast.error("Please upload a service image!");
      return;
    }

    if (Number(formData.basePrice) <= 0) {
      toast.error("Base price must be greater than zero!");
      return;
    }

    try {
      setIsSubmitting(true);

      // Step 1: Get JWT token
      const token = await getAuthToken();

      const authHeaders = {
        Authorization: `Bearer ${token}`,
      };

      // Step 2: Upload image to ImgBB through backend
      const imageResponse = await api.post(
        "/api/images/upload",
        {
          image: imagePreview,
        },
        {
          headers: authHeaders,
        }
      );

      const imageUrl = imageResponse.data?.imageUrl;

      if (!imageResponse.data?.success || !imageUrl) {
        throw new Error("Image upload failed!");
      }

      // Step 3: Create service
      const servicePayload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        image: imageUrl,
      };

      const serviceResponse = await api.post(
        "/api/services",
        servicePayload,
        {
          headers: authHeaders,
        }
      );

      if (!serviceResponse.data?.success) {
        throw new Error(
          serviceResponse.data?.message || "Service creation failed!"
        );
      }

      toast.success(
        "Service created successfully! Waiting for admin approval."
      );

      resetForm();
    } catch (error) {
      console.error("Add Service Error:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Unable to create service. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
        Add New Service
      </h1>

      <p className="mt-2 text-slate-500">
        Create a repair service listing and reach more customers.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
      >
        <div className="mb-8 flex items-center gap-3 border-b border-slate-100 pb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiPlusCircle size={24} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Create Repair Service
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Fill in the details below to publish your service.
            </p>
          </div>
        </div>

        {/* Technician Information */}
        <div className="mb-8">
          <h3 className="mb-4 font-semibold text-slate-800">
            Technician Information
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Technician Name
              </label>

              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Technician Email
              </label>

              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Service Information */}
        <div>
          <h3 className="mb-4 font-semibold text-slate-800">
            Service Information
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Title */}
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Service Title <span className="text-red-500">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Professional Smartphone Repair"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Category <span className="text-red-500">*</span>
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Base Price */}
            <div>
              <label
                htmlFor="basePrice"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Base Price (৳) <span className="text-red-500">*</span>
              </label>

              <input
                id="basePrice"
                name="basePrice"
                type="number"
                min="0.01"
                step="0.01"
                value={formData.basePrice}
                onChange={handleChange}
                placeholder="Enter service price"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Estimated Duration */}
            <div>
              <label
                htmlFor="estimatedDuration"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Estimated Duration <span className="text-red-500">*</span>
              </label>

              <input
                id="estimatedDuration"
                name="estimatedDuration"
                type="text"
                value={formData.estimatedDuration}
                onChange={handleChange}
                placeholder="e.g. 2 hours or 1-2 days"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Service Mode */}
            <div>
              <label
                htmlFor="serviceMode"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Service Mode <span className="text-red-500">*</span>
              </label>

              <select
                id="serviceMode"
                name="serviceMode"
                value={formData.serviceMode}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Service Mode</option>

                {serviceModes.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Area */}
            <div className="md:col-span-2">
              <label
                htmlFor="serviceArea"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Service Area <span className="text-red-500">*</span>
              </label>

              <input
                id="serviceArea"
                name="serviceArea"
                type="text"
                value={formData.serviceArea}
                onChange={handleChange}
                placeholder="e.g. Bashundhara, Dhaka"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Description <span className="text-red-500">*</span>
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your repair service, supported devices and what customers can expect..."
                required
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>

        {/* Service Image */}
        <div className="mt-8">
          <h3 className="mb-4 font-semibold text-slate-800">
            Service Image
          </h3>

          <label
            htmlFor="service-image"
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-blue-500 hover:bg-blue-50"
          >
            <FiUpload className="text-3xl text-blue-600" />

            <span className="mt-3 font-semibold text-slate-800">
              Upload Service Image
            </span>

            <span className="mt-1 text-sm text-slate-500">
              Choose an image from your device
            </span>

            <span className="mt-2 text-xs text-slate-400">
              Image files only
            </span>

            <input
              id="service-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {imagePreview && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-medium text-slate-700">
                Image Preview
              </p>

              <div className="relative max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={imagePreview}
                  alt="Service preview"
                  className="h-56 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");

                    const input = document.getElementById("service-image");
                    if (input) input.value = "";
                  }}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 text-red-500 shadow hover:bg-red-50"
                  aria-label="Remove image"
                >
                  <FiX size={18} />
                </button>
              </div>

              <p className="mt-2 break-all text-xs text-slate-500">
                {imageFile?.name}
              </p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="animate-spin" />
                Uploading & Creating...
              </>
            ) : (
              <>
                <FiPlusCircle />
                Create Service
              </>
            )}
          </button>

          <p className="mt-4 text-sm text-slate-500">
            Your service will remain pending until an admin approves it.
          </p>
        </div>
      </form>
    </div>
  );
}



function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [completionBooking, setCompletionBooking] = useState(null);
  const [finalAmount, setFinalAmount] = useState("");
  const [completing, setCompleting] = useState(false);

  const getAuthToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found. Please login again.");
    }

    return data.token;
  };

  const getHeaders = async () => {
    const token = await getAuthToken();

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch technician bookings
  const fetchBookings = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const headers = await getHeaders();

      const response = await api.get(
        "/api/bookings/technician-bookings",
        { headers }
      );

      setBookings(response.data.bookings || []);
    } catch (error) {
  console.error("Fetch Bookings Error:", error);

  if (!isLogoutInProgress()) {
    toast.error(
      error.response?.data?.message || "Failed to load bookings."
    );
  }
} finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update booking status
  const handleStatusUpdate = async (booking, newStatus, amount = null) => {
    const confirmMessage = {
      accepted: "Are you sure you want to accept this booking?",
      rejected: "Are you sure you want to reject this booking?",
      "in-progress": "Start working on this repair?",
    };

    if (
      newStatus !== "completed" &&
      !window.confirm(confirmMessage[newStatus])
    ) {
      return;
    }

    try {
      setUpdatingId(booking._id);

      const headers = await getHeaders();

      const payload = {
        status: newStatus,
      };

      // Final amount is required when completing a booking
      if (newStatus === "completed") {
        payload.finalAmount = Number(amount);
      }

      const response = await api.patch(
        `/api/bookings/${booking._id}/status`,
        payload,
        { headers }
      );

      if (!response.data.success) {
        throw new Error(
          response.data.message || "Booking status update failed."
        );
      }

      toast.success(
        response.data.message || "Booking status updated successfully!"
      );

      setCompletionBooking(null);
      setFinalAmount("");

      await fetchBookings(true);
    } catch (error) {
      console.error("Update Booking Error:", error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update booking status."
      );
    } finally {
      setUpdatingId(null);
      setCompleting(false);
    }
  };

  // Open completion modal
  const openCompletionModal = (booking) => {
    setCompletionBooking(booking);
    setFinalAmount(
      booking.finalAmount != null ? String(booking.finalAmount) : ""
    );
  };

  // Submit completed booking
  const handleCompleteBooking = async (e) => {
    e.preventDefault();

    if (
      finalAmount.trim() === "" ||
      !Number.isFinite(Number(finalAmount)) ||
      Number(finalAmount) < 0
    ) {
      toast.error("Please enter a valid final amount.");
      return;
    }

    setCompleting(true);

    await handleStatusUpdate(
      completionBooking,
      "completed",
      finalAmount
    );
  };

  // Status badge styles
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "bg-blue-100 text-blue-700";

      case "in-progress":
        return "bg-purple-100 text-purple-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "cancelled":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return "Requested";

    return status
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "Not specified";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      booking.serviceTitle?.toLowerCase().includes(searchText) ||
      booking.customerName?.toLowerCase().includes(searchText) ||
      booking.customerEmail?.toLowerCase().includes(searchText) ||
      booking.customerPhone?.toLowerCase().includes(searchText) ||
      booking.category?.toLowerCase().includes(searchText) ||
      booking.address?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      booking.status?.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const requestedCount = bookings.filter(
    (booking) => booking.status === "requested"
  ).length;

  const acceptedCount = bookings.filter(
    (booking) => booking.status === "accepted"
  ).length;

  const progressCount = bookings.filter(
    (booking) => booking.status === "in-progress"
  ).length;

  const completedCount = bookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            My Bookings
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage customer repair requests and track your job progress.
          </p>
        </div>

        <button
          onClick={() => fetchBookings(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">New Requests</p>
          <h3 className="mt-2 text-3xl font-bold text-amber-600">
            {requestedCount}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Accepted</p>
          <h3 className="mt-2 text-3xl font-bold text-blue-600">
            {acceptedCount}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">In Progress</p>
          <h3 className="mt-2 text-3xl font-bold text-purple-600">
            {progressCount}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Completed</p>
          <h3 className="mt-2 text-3xl font-bold text-green-600">
            {completedCount}
          </h3>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer, service, phone..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Bookings</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Booking List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center">
          <FiCalendar className="mx-auto text-4xl text-slate-300" />

          <h3 className="mt-4 text-lg font-bold text-slate-800">
            No Bookings Found
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {bookings.length === 0
              ? "Customer bookings will appear here when someone books your service."
              : "No bookings match your current search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredBookings.map((booking) => {
            const status = booking.status?.toLowerCase();
            const isUpdating = updatingId === booking._id;

            return (
              <div
                key={booking._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
              >
                {/* Booking Header */}
                <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    {booking.serviceImage ? (
                      <img
                        src={booking.serviceImage}
                        alt={booking.serviceTitle || "Service"}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <FiTool size={25} />
                      </div>
                    )}

                    <div>
                      <span className="text-xs font-semibold text-blue-600">
                        {booking.category || "Repair Service"}
                      </span>

                      <h3 className="mt-1 font-bold text-slate-900">
                        {booking.serviceTitle || "Repair Service"}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Booking ID: {booking._id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(status)}`}
                  >
                    {formatStatus(status)}
                  </span>
                </div>

                {/* Booking Details */}
                <div className="grid gap-6 p-5 lg:grid-cols-2">
                  {/* Customer Information */}
                  <div>
                    <h4 className="mb-4 font-semibold text-slate-800">
                      Customer Information
                    </h4>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">Customer Name</p>
                        <p className="mt-1 font-medium text-slate-800">
                          {booking.customerName || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Email</p>
                        <p className="mt-1 break-all font-medium text-slate-800">
                          {booking.customerEmail || "Not available"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Phone</p>
                        <p className="mt-1 font-medium text-slate-800">
                          {booking.customerPhone || "Not provided"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Service Address</p>
                        <p className="mt-1 font-medium leading-6 text-slate-800">
                          {booking.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Repair Information */}
                  <div>
                    <h4 className="mb-4 font-semibold text-slate-800">
                      Repair Information
                    </h4>

                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400">
                          Preferred Date
                        </p>
                        <p className="mt-1 font-medium text-slate-800">
                          {formatDate(booking.preferredDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Base Price</p>
                        <p className="mt-1 font-bold text-slate-900">
                          ৳{Number(booking.basePrice || 0).toLocaleString("en-BD")}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400">Payment Status</p>
                        <p className="mt-1 font-semibold capitalize text-slate-800">
                          {booking.paymentStatus || "Unpaid"}
                        </p>
                      </div>

                      {booking.finalAmount != null && (
                        <div>
                          <p className="text-xs text-slate-400">
                            Final Amount
                          </p>
                          <p className="mt-1 font-bold text-green-700">
                            ৳{Number(booking.finalAmount).toLocaleString("en-BD")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Problem Description */}
                  <div className="rounded-xl bg-slate-50 p-4 lg:col-span-2">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Customer Problem Description
                    </h4>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {booking.problemDescription ||
                        "No problem description provided."}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500">
                    Booking Status:{" "}
                    <span className="font-semibold text-slate-700">
                      {formatStatus(status)}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {status === "requested" && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking, "accepted")}
                          disabled={isUpdating}
                          className="rounded-lg bg-green-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                        >
                          {isUpdating ? "Updating..." : "Accept Booking"}
                        </button>

                        <button
                          onClick={() => handleStatusUpdate(booking, "rejected")}
                          disabled={isUpdating}
                          className="rounded-lg bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {status === "accepted" && (
                      <button
                        onClick={() => handleStatusUpdate(booking, "in-progress")}
                        disabled={isUpdating}
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                      >
                        {isUpdating ? "Updating..." : "Start Job"}
                      </button>
                    )}

                    {status === "in-progress" && (
                      <button
                        onClick={() => openCompletionModal(booking)}
                        disabled={isUpdating}
                        className="rounded-lg bg-green-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {status === "completed" && (
                      <span className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-xs font-semibold text-green-700">
                        <FiCheckCircle />
                        Job Completed
                      </span>
                    )}

                    {(status === "rejected" || status === "cancelled") && (
                      <span className="rounded-lg bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-500">
                        No further action
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Completion Modal */}
      {completionBooking && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
              <FiCheckCircle size={27} />
            </div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Complete Repair Job
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Enter the final repair amount for{" "}
              <span className="font-semibold text-slate-800">
                {completionBooking.serviceTitle}
              </span>
              .
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Base Price</p>
              <p className="mt-1 text-lg font-bold text-slate-900">
                ৳{Number(completionBooking.basePrice || 0).toLocaleString("en-BD")}
              </p>
            </div>

            <form onSubmit={handleCompleteBooking}>
              <label className="mb-2 mt-5 block text-sm font-semibold text-slate-700">
                Final Amount (৳)
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                placeholder="Enter final repair amount"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-slate-400">
                You can enter the same amount as the base price or adjust it.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCompletionBooking(null);
                    setFinalAmount("");
                  }}
                  disabled={completing}
                  className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={completing}
                  className="flex-1 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
                >
                  {completing ? "Completing..." : "Confirm Complete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    area: "",
    bio: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Get authentication token
  const getAuthToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error(
        error?.message || "Authentication token could not be retrieved!"
      );
    }

    return data.token;
  };

  // Fetch profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);

      const token = await getAuthToken();

      const response = await api.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data?.success || !response.data?.user) {
        throw new Error("Unable to load profile!");
      }

      const userData = response.data.user;

      setProfile({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        area: userData.area || "",
        bio: userData.bio || "",
        image: userData.image || "",
      });

      setImagePreview(userData.image || "");
    } catch (error) {
      console.error("Fetch Profile Error:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Unable to load profile!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle profile image
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image!");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.onerror = () => {
      toast.error("Unable to read the selected image!");
      setImageFile(null);
      setImagePreview(profile.image || "");
    };

    reader.readAsDataURL(file);
  };

  // Save profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Name is required!");
      return;
    }

    try {
      setIsSaving(true);

      const token = await getAuthToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let imageUrl = profile.image;

      // Upload new image only if selected
      if (imageFile && imagePreview) {
        const imageResponse = await api.post(
          "/api/images/upload",
          {
            image: imagePreview,
          },
          {
            headers,
          }
        );

        imageUrl = imageResponse.data?.imageUrl;

        if (!imageResponse.data?.success || !imageUrl) {
          throw new Error("Profile image upload failed!");
        }
      }

      // Update profile
      const response = await api.patch(
        "/api/profile",
        {
          name: profile.name.trim(),
          phone: profile.phone.trim(),
          area: profile.area.trim(),
          bio: profile.bio.trim(),
          image: imageUrl || "",
        },
        {
          headers,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Profile update failed!"
        );
      }

      const updatedUser = response.data.user;

      setProfile({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        area: updatedUser.area || "",
        bio: updatedUser.bio || "",
        image: updatedUser.image || "",
      });

      setImagePreview(updatedUser.image || "");
      setImageFile(null);

      const fileInput = document.getElementById("technician-profile-image");

      if (fileInput) fileInput.value = "";

      toast.success("Profile updated successfully!");

    } catch (error) {
      console.error("Update Profile Error:", error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Unable to update profile!"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <FiLoader className="animate-spin text-3xl text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          My Profile
        </h1>

        <p className="mt-2 text-slate-500">
          Manage your technician account information.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"
      >
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-5 border-b border-slate-100 pb-8 sm:flex-row">
          <div className="relative">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Technician profile"
                className="h-28 w-28 rounded-full border-4 border-blue-100 object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <FiUser size={45} />
              </div>
            )}

            <label
              htmlFor="technician-profile-image"
              className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow transition hover:bg-blue-700"
            >
              <FiCamera size={16} />
            </label>

            <input
              id="technician-profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">
              {profile.name || user?.name || "Technician"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {profile.email || user?.email}
            </p>

            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              <FiTool size={13} />
              Technician Account
            </span>

            <p className="mt-2 text-xs text-slate-400">
              Click the camera icon to change your profile picture.
            </p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mt-8">
          <h3 className="mb-5 text-lg font-bold text-slate-800">
            Personal Information
          </h3>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="technician-name"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Full Name *
              </label>

              <input
                id="technician-name"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                maxLength={100}
                required
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="technician-email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>

              <input
                id="technician-email"
                type="email"
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
              />

              <p className="mt-1 text-xs text-slate-400">
                Email address cannot be changed here.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="technician-phone"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Phone Number
              </label>

              <input
                id="technician-phone"
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                maxLength={20}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Area */}
            <div>
              <label
                htmlFor="technician-area"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Service Area
              </label>

              <input
                id="technician-area"
                type="text"
                name="area"
                value={profile.area}
                onChange={handleChange}
                maxLength={100}
                placeholder="e.g. Bashundhara, Dhaka"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <label
                htmlFor="technician-bio"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                About Me
              </label>

              <textarea
                id="technician-bio"
                name="bio"
                rows={5}
                value={profile.bio}
                onChange={handleChange}
                maxLength={500}
                placeholder="Tell customers about your repair experience, expertise and services..."
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-right text-xs text-slate-400">
                {profile.bio.length}/500 characters
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 rounded-xl bg-slate-50 p-5">
          <h3 className="font-semibold text-slate-800">
            Account Information
          </h3>

          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="rounded-lg bg-white px-3 py-2 text-slate-600">
              Role: Technician
            </span>

            <span className="rounded-lg bg-white px-3 py-2 text-slate-600">
              Email: {profile.email ? "Registered" : "Unavailable"}
            </span>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <FiLoader className="animate-spin" />
                Saving Changes...
              </>
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>

          <button
            type="button"
            onClick={fetchProfile}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <FiRefreshCw />
            Reload Profile
          </button>
        </div>
      </form>
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
          className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                    className={`flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left text-sm font-semibold transition ${isActive
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
