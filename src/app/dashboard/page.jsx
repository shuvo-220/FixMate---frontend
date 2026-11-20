"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "../lib/auth-client";
import api from "../lib/axios";
import { toast } from "sonner";

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


function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelling, setCancelling] = useState(false);

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

      const response = await api.get("/api/bookings/my-bookings", {
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

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      setCancelling(true);

      const token = await getToken();

      const bookingId = selectedBooking._id;

      const response = await api.patch(
        `/api/bookings/${bookingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data.message || "Booking cancelled successfully!"
      );

      setSelectedBooking(null);

      await fetchBookings();
    } catch (error) {
      console.error("Cancel Booking Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to cancel booking!"
      );
    } finally {
      setCancelling(false);
    }
  };

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

  const filteredBookings = bookings.filter((booking) => {
    const searchText = [
      booking.serviceTitle,
      booking.category,
      booking.technicianName,
      booking.technicianEmail,
      booking.address,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            My Bookings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track and manage all your repair service bookings.
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
          placeholder="Search service or technician..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 md:flex-1"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Bookings</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Booking List */}
      <div className="space-y-5">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-500">
            Loading your bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <h3 className="font-semibold text-slate-700">
              No bookings found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Your booking history will appear here.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md"
            >
              <div className="flex flex-col gap-5 p-5 md:flex-row">
                {/* Service Image */}
                <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 md:h-36 md:w-40">
                  {booking.serviceImage ? (
                    <img
                      src={booking.serviceImage}
                      alt={booking.serviceTitle || "Service"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl">
                      🛠️
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {booking.category || "Repair Service"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status || "Unknown"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900">
                    {booking.serviceTitle || "Repair Service"}
                  </h3>

                  <div className="grid grid-cols-1 gap-2 text-sm text-slate-600 sm:grid-cols-2">
                    <p>
                      <span className="font-semibold text-slate-800">
                        Technician:
                      </span>{" "}
                      {booking.technicianName || "Not assigned"}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-800">
                        Preferred Date:
                      </span>{" "}
                      {formatDate(booking.preferredDate)}
                    </p>

                    <p>
                      <span className="font-semibold text-slate-800">
                        Payment:
                      </span>{" "}
                      <span className="capitalize">
                        {booking.paymentStatus || "Unpaid"}
                      </span>
                    </p>

                    <p>
                      <span className="font-semibold text-slate-800">
                        Amount:
                      </span>{" "}
                      {booking.finalAmount != null
                        ? Number(booking.finalAmount).toLocaleString()
                        : "Not finalized"}
                    </p>
                  </div>

                  {booking.address && (
                    <p className="break-words text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">
                        Address:
                      </span>{" "}
                      {booking.address}
                    </p>
                  )}

                  {booking.problemDescription && (
                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">
                        Problem:
                      </span>{" "}
                      {booking.problemDescription}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <p className="text-xs text-slate-400">
                      Booking ID: {booking._id}
                    </p>

                    {booking.status?.toLowerCase() === "requested" && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
              !
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Cancel Booking?
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to cancel your booking for{" "}
              <span className="font-semibold text-slate-800">
                {selectedBooking.serviceTitle}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedBooking(null)}
                disabled={cancelling}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Keep Booking
              </button>

              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

      const response = await api.get("/api/payments/my-payments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPayments(response.data.payments || []);
    } catch (error) {
      console.error("Fetch Payments Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load payment history!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
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

  const formatAmount = (amount, currency) => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "USD").toUpperCase(),
    }).format(value);
  };

  const filteredPayments = payments.filter((payment) => {
    const searchText = [
      payment.serviceTitle,
      payment.transactionId,
      payment.bookingId,
      payment.paymentStatus,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchText.includes(search.toLowerCase());
  });

  const totalPaid = payments
    .filter((payment) => payment.paymentStatus?.toLowerCase() === "paid")
    .reduce((total, payment) => total + Number(payment.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            Payment History
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            View and track all your repair service payments.
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
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <FiCreditCard size={23} />
          </div>

          <p className="text-sm text-slate-500">Total Transactions</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {payments.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <FiCheckCircle size={23} />
          </div>

          <p className="text-sm text-slate-500">Total Amount Paid</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {formatAmount(totalPaid, "USD")}
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <input
          type="text"
          placeholder="Search by service, booking ID or transaction ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500"
        />
      </div>

      {/* Payment List */}
      <div className="space-y-4">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-500">
            Loading payment history...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
            <FiCreditCard className="mx-auto text-4xl text-slate-400" />

            <h3 className="mt-4 font-semibold text-slate-700">
              No payment records found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Your successful payment transactions will appear here.
            </p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <div
              key={payment._id || payment.stripeSessionId}
              className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-md md:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <FiCreditCard size={23} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {payment.serviceTitle || "Repair Service"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>
                </div>

                <div className="sm:text-right">
                  <h3 className="text-xl font-bold text-slate-900">
                    {formatAmount(payment.amount, payment.currency)}
                  </h3>

                  <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                    {payment.paymentStatus || "Paid"}
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Transaction ID</p>

                  <p className="mt-1 break-all font-medium text-slate-700">
                    {payment.transactionId || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Booking ID</p>

                  <p className="mt-1 break-all font-medium text-slate-700">
                    {payment.bookingId || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}



function Profile() {
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get Authentication Token
  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Authentication token not found!");
    }

    return data.token;
  };

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await api.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.user;

      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        area: user.area || "",
        bio: user.bio || "",
        image: user.image || "",
      });

      setImagePreview(user.image || "");
    } catch (error) {
      console.error("Fetch Profile Error:", error);

      toast.error(
        error.response?.data?.message || "Failed to load profile!"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Image Selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image!");
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // Update Profile
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = await getToken();

      let imageUrl = profile.image;

      // Upload New Image to ImgBB
      if (imageFile) {
        const imageResponse = await api.post(
          "/api/images/upload",
          {
            image: imagePreview,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        imageUrl = imageResponse.data.imageUrl;

        if (!imageUrl) {
          throw new Error("Image upload failed!");
        }
      }

      // Update Profile Information
      const response = await api.patch(
        "/api/profile",
        {
          name: profile.name,
          phone: profile.phone,
          area: profile.area,
          bio: profile.bio,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      toast.success(
        response.data.message || "Profile updated successfully!"
      );
    } catch (error) {
      console.error("Update Profile Error:", error);

      toast.error(
        error.response?.data?.message || error.message || "Failed to update profile!"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
        <p className="text-sm font-medium text-slate-500">
          Loading your profile...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            My Profile
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your personal information and profile details.
          </p>
        </div>

        <button
          onClick={fetchProfile}
          disabled={loading || saving}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Refresh Profile
        </button>
      </div>

      {/* Profile Form */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
      >
        {/* Profile Image Section */}
        <div className="border-b border-slate-100 bg-slate-50 p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-900">
            Profile Photo
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Upload a photo to personalize your account.
          </p>

          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row">
            <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-100 text-3xl font-bold text-blue-600 shadow">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                profile.name?.charAt(0)?.toUpperCase() || "U"
              )}
            </div>

            <div>
              <label
                htmlFor="profileImage"
                className="inline-flex cursor-pointer items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Choose Profile Image
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              <p className="mt-2 text-xs text-slate-500">
                Select an image from your device.
              </p>

              {imageFile && (
                <p className="mt-2 text-xs font-medium text-green-600">
                  New image selected successfully.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="space-y-6 p-6 md:p-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Personal Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your account information below.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name *
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
              />

              <p className="mt-1 text-xs text-slate-400">
                Email address cannot be changed.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                maxLength={20}
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Area */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Your Area
              </label>

              <input
                type="text"
                name="area"
                value={profile.area}
                onChange={handleChange}
                maxLength={100}
                placeholder="Enter your area or location"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              About Me
            </label>

            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              maxLength={500}
              rows={5}
              placeholder="Write something about yourself..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {profile.bio.length}/500 characters
            </p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


export default function CustomerDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeMenu) {
      case "My Bookings":
        return <MyBookings />;

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
