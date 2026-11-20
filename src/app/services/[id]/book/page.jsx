"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiPhone,
  FiTool,
  FiUser,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "sonner";
import api from "../../../lib/axios";
import { authClient } from "../../../lib/auth-client";

export default function BookServicePage() {
  const { id } = useParams();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    customerPhone: "",
    address: "",
    preferredDate: "",
    problemDescription: "",
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await api.get(`/api/services/${id}`);
        setService(response.data.service);
      } catch (error) {
        console.error("Service fetch error:", error);
        toast.error(
          error.response?.data?.message || "Failed to load service."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!service) return;

    if (
      !formData.customerPhone.trim() ||
      !formData.address.trim() ||
      !formData.preferredDate ||
      !formData.problemDescription.trim()
    ) {
      toast.error("Please complete all booking fields.");
      return;
    }

    try {
      setSubmitting(true);

      const tokenResponse = await authClient.token();
      const token = tokenResponse?.data?.token;

      if (!token) {
        toast.error("Please login to book a service.");
        router.push("/login");
        return;
      }

      const response = await api.post(
        "/api/bookings",
        {
          serviceId: id,
          customerPhone: formData.customerPhone.trim(),
          address: formData.address.trim(),
          preferredDate: formData.preferredDate,
          problemDescription: formData.problemDescription.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        response.data.message || "Booking request submitted successfully!"
      );

      router.push("/dashboard");
    } catch (error) {
      console.error("Booking error:", error);

      toast.error(
        error.response?.data?.message || "Failed to submit booking request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </main>
    );
  }

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Service Not Available
          </h2>
          <Link
            href="/services"
            className="mt-5 inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
          >
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/services/${id}`}
          className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to Service Details
        </Link>

        <div className="grid items-start gap-8 lg:grid-cols-5">
          {/* Booking Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-3">
            <div className="mb-8">
              <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
                FixMate Booking
              </span>

              <h1 className="mt-2 text-3xl font-extrabold text-slate-950">
                Book Your Service
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Fill in the information below to send your booking request
                to the technician.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Phone */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Phone Number *
                </label>

                <div className="relative">
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Service Address *
                </label>

                <div className="relative">
                  <FiMapPin className="absolute left-4 top-4 text-slate-400" />

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                    rows={3}
                    required
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Preferred Service Date *
                </label>

                <div className="relative">
                  <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toLocaleDateString("en-CA")}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Describe Your Problem *
                </label>

                <textarea
                  name="problemDescription"
                  value={formData.problemDescription}
                  onChange={handleChange}
                  placeholder="Describe the device problem or repair work you need..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Submit Booking Request
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                Your booking request will be sent to the service technician
                for confirmation.
              </p>
            </form>
          </div>

          {/* Service Summary */}
          <div className="space-y-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-52 bg-slate-100">
                <img
                  src={service.image || "/placeholder-service.png"}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="p-6">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                  {service.category}
                </span>

                <h2 className="mt-4 text-xl font-extrabold text-slate-900">
                  {service.title}
                </h2>

                <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <FiTool className="text-blue-600" />
                      Service Mode
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {service.serviceMode}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <FiClock className="text-blue-600" />
                      Duration
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {service.estimatedDuration}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <FiMapPin className="text-blue-600" />
                      Service Area
                    </span>
                    <span className="text-right text-sm font-bold text-slate-800">
                      {service.serviceArea}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-blue-50 p-5">
                  <p className="text-sm font-semibold text-blue-700">
                    Starting Price
                  </p>
                  <p className="mt-1 text-3xl font-extrabold text-blue-700">
                    ৳{Number(service.basePrice || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-center gap-3">
                <FiCheckCircle className="text-xl text-emerald-600" />
                <h3 className="font-extrabold text-emerald-800">
                  Secure Booking
                </h3>
              </div>

              <p className="mt-2 text-sm leading-6 text-emerald-700">
                Your personal information is handled securely. The technician
                will receive your request and can respond through FixMate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
