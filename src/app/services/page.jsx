"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiTool,
  FiClock,
  FiMapPin,
  FiArrowRight,
  FiRefreshCw,
  FiFilter,
} from "react-icons/fi";
import api from "../lib/axios";
import { toast } from "sonner";

const categories = [
  "All Categories",
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
];

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [serviceMode, setServiceMode] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const fetchServices = async () => {
    try {
      setLoading(true);

      const params = {};

      if (search.trim()) params.search = search.trim();

      if (category !== "All Categories") {
        params.category = category;
      }

      if (serviceMode !== "All") {
        params.serviceMode = serviceMode;
      }

      if (sortBy === "price-low") {
        params.sortBy = "basePrice";
        params.order = "asc";
      } else if (sortBy === "price-high") {
        params.sortBy = "basePrice";
        params.order = "desc";
      } else {
        params.sortBy = "createdAt";
        params.order = "desc";
      }

      const response = await api.get("/api/services", { params });

      setServices(response.data.services || []);
    } catch (error) {
      console.error("Fetch services error:", error);
      toast.error(
        error.response?.data?.message || "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [search, category, serviceMode, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setServiceMode("All");
    setSortBy("newest");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-950 px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-widest text-blue-400">
              FixMate Services
            </span>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-5xl">
              Find the Right Repair
              <span className="text-blue-400"> Service</span>
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-300">
              Explore professional repair services for your devices
              and home appliances. Find the right technician for your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {/* Search and Filters */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <FiFilter className="text-blue-600" />
              <h2 className="font-bold text-slate-900">
                Find Your Service
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Category */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* Service Mode */}
              <select
                value={serviceMode}
                onChange={(e) => setServiceMode(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="All">All Service Modes</option>
                <option value="Home Visit">Home Visit</option>
                <option value="Shop Drop-off">Shop Drop-off</option>
              </select>

              {/* Sorting */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Heading */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Available Services
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading services..."
                  : `${services.length} services found`}
              </p>
            </div>

            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600"
            >
              <FiRefreshCw />
              Reset Filters
            </button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-52 bg-slate-200" />
                  <div className="space-y-3 p-5">
                    <div className="h-5 w-2/3 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-4 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            /* Empty State */
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl text-blue-600">
                <FiTool />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-900">
                No Services Found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                We couldn't find any services matching your search.
                Try changing your filters.
              </p>

              <button
                onClick={resetFilters}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            /* Service Cards */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={service.image || "/placeholder-service.png"}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow">
                      {service.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-extrabold text-slate-900 transition group-hover:text-blue-600">
                        {service.title}
                      </h3>

                      <p className="shrink-0 text-lg font-extrabold text-blue-600">
                        ৳{Number(service.basePrice || 0).toLocaleString()}
                      </p>
                    </div>

                    <p className="mt-3 min-h-12 text-sm leading-6 text-slate-500">
                      {service.description?.length > 100
                        ? `${service.description.slice(0, 100)}...`
                        : service.description}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiClock className="text-blue-600" />
                        <span>
                          {service.estimatedDuration || "Duration not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiMapPin className="text-blue-600" />
                        <span>
                          {service.serviceArea || "Area not specified"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <FiTool className="text-blue-600" />
                        <span>{service.serviceMode}</span>
                      </div>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-blue-600"
                    >
                      View Details
                      <FiArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
