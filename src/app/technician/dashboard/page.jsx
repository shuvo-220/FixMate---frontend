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
  FiUpload,
  FiImage,
  FiLoader,
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
          Service listing management will be connected in the next step.
        </p>
      </div>
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
