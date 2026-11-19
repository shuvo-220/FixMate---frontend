import Link from "next/link";
import {
  FiArrowRight,
  FiCheckCircle,
  FiShield,
  FiClock,
  FiTool,
} from "react-icons/fi";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Background Decoration */}
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 md:py-28 lg:grid-cols-2 lg:gap-20 lg:px-8">

        {/* Left Content */}
        <div>
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Your Trusted Repair Service Platform
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Repair Made
            <span className="text-blue-600"> Simple, </span>
            Life Made
            <span className="text-blue-600"> Better.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
            Find trusted technicians for your smartphones, laptops, and home
            appliances. Book reliable repair services without the hassle.
          </p>

          {/* CTA Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-4 font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Explore Services
              <FiArrowRight />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-800 transition hover:border-blue-300 hover:bg-blue-50"
            >
              Become a Technician
            </Link>
          </div>

          {/* Trust Points */}
          <div className="mt-10 grid grid-cols-1 gap-4 text-sm font-semibold text-slate-600 sm:grid-cols-3">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="shrink-0 text-green-500" />
              Trusted Technicians
            </div>

            <div className="flex items-center gap-2">
              <FiShield className="shrink-0 text-blue-600" />
              Secure Booking
            </div>

            <div className="flex items-center gap-2">
              <FiClock className="shrink-0 text-blue-600" />
              Easy Scheduling
            </div>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -left-5 top-10 h-24 w-24 rounded-3xl bg-blue-200/70 blur-2xl" />
          <div className="absolute -bottom-5 -right-5 h-32 w-32 rounded-full bg-indigo-200/70 blur-2xl" />

          <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-blue-100 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Repair Solutions
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  We Fix It All.
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-3xl text-white shadow-lg shadow-blue-200">
                <FiTool />
              </div>
            </div>

            {/* Service Cards */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-blue-50 p-5">
                <div className="text-3xl">📱</div>
                <h3 className="mt-4 font-bold text-slate-900">
                  Smartphone
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Screen, battery & more
                </p>
              </div>

              <div className="rounded-2xl bg-indigo-50 p-5">
                <div className="text-3xl">💻</div>
                <h3 className="mt-4 font-bold text-slate-900">
                  Laptop & PC
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Hardware & software
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 p-5">
                <div className="text-3xl">❄️</div>
                <h3 className="mt-4 font-bold text-slate-900">
                  AC Repair
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Cooling solutions
                </p>
              </div>

              <div className="rounded-2xl bg-amber-50 p-5">
                <div className="text-3xl">🔌</div>
                <h3 className="mt-4 font-bold text-slate-900">
                  Electrical
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Safe & reliable repair
                </p>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-950 p-4 text-white">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl">
                <FiShield />
              </div>

              <div>
                <p className="font-bold">Reliable Service, Every Time</p>
                <p className="mt-1 text-xs text-slate-400">
                  Connect with professional technicians.
                </p>
              </div>

              <FiCheckCircle className="ml-auto shrink-0 text-xl text-green-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
