"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiTool,
  FiUser,
  FiMail,
  FiPhone,
  FiShield,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import api from "../../lib/axios";
import { toast } from "sonner";

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/api/services/${params.id}`);

        setService(response.data.service);
      } catch (error) {
        console.error("Service details error:", error);

        toast.error(
          error.response?.data?.message || "Failed to load service details."
        );

        setService(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchService();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-7 w-32 rounded bg-slate-200" />
          <div className="mt-8 grid gap-10 lg:grid-cols-2">
            <div className="h-80 rounded-2xl bg-slate-200 lg:h-[480px]" />
            <div className="space-y-5">
              <div className="h-8 w-2/3 rounded bg-slate-200" />
              <div className="h-5 w-full rounded bg-slate-200" />
              <div className="h-5 w-1/2 rounded bg-slate-200" />
              <div className="h-40 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <FiTool className="mx-auto text-4xl text-slate-400" />

          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
            Service Not Found
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            This service may no longer be available.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="px-5 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
          >
            <FiArrowLeft />
            Back
          </button>

          <div className="grid items-start gap-8 lg:grid-cols-5">
            {/* Left: Image and Description */}
            <div className="space-y-7 lg:col-span-3">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-72 bg-slate-100 sm:h-[430px]">
                  <img
                    src={service.image || "/placeholder-service.png"}
                    alt={service.title}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-6 sm:p-8">
                  <span className="inline-flex rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600">
                    {service.category}
                  </span>

                  <h1 className="mt-4 text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
                    {service.title}
                  </h1>

                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-2">
                      <FiClock className="text-blue-600" />
                      {service.estimatedDuration || "Not specified"}
                    </span>

                    <span className="flex items-center gap-2">
                      <FiMapPin className="text-blue-600" />
                      {service.serviceArea || "Not specified"}
                    </span>
                  </div>

                  <div className="mt-8 border-t border-slate-100 pt-7">
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Service Description
                    </h2>

                    <p className="mt-3 whitespace-pre-line text-sm leading-8 text-slate-600">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Booking and Technician Information */}
            <div className="space-y-6 lg:col-span-2">
              {/* Price Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-slate-500">
                  Starting Price
                </p>

                <h2 className="mt-2 text-4xl font-extrabold text-blue-600">
                  ৳{Number(service.basePrice || 0).toLocaleString()}
                </h2>

                <p className="mt-2 text-xs text-slate-400">
                  Final amount may depend on the repair work required.
                </p>

                <div className="my-6 space-y-4 border-y border-slate-100 py-5">
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
                      {service.estimatedDuration || "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <FiMapPin className="text-blue-600" />
                      Service Area
                    </span>

                    <span className="text-right text-sm font-bold text-slate-800">
                      {service.serviceArea || "Not specified"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/services/${service._id}/book`)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-4 font-bold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
                >
                  <FiCalendar />
                  Book This Service
                </button>

                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <FiShield className="text-emerald-500" />
                  Secure booking with FixMate
                </p>
              </div>

              {/* Technician Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Service Provider
                </h3>

                <div className="mt-5 flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                    <FiUser />
                  </div>

                  <div className="min-w-0">
                    <h4 className="truncate font-bold text-slate-900">
                      {service.technicianName || "FixMate Technician"}
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      Verified service provider
                    </p>
                  </div>
                </div>

                {service.technicianEmail && (
                  <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <FiMail className="shrink-0 text-blue-600" />
                    <span className="break-all text-sm text-slate-600">
                      {service.technicianEmail}
                    </span>
                  </div>
                )}

                <div className="mt-5 flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
                  <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-600" />

                  <p className="text-xs leading-6 text-emerald-700">
                    This service has been approved by the FixMate admin team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
