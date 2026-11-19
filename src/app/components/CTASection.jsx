import Link from "next/link";
import {
  FiArrowRight,
  FiTool,
  FiCheckCircle,
} from "react-icons/fi";

export default function CTASection() {
  return (
    <section className="bg-slate-50 px-5 py-16 sm:py-20 lg:px-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-14 text-center shadow-xl shadow-blue-200 sm:px-12 sm:py-20">

        {/* Background Decoration */}
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full border-[40px] border-white/10" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full border-[50px] border-white/10" />

        <div className="relative mx-auto max-w-3xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-3xl text-white backdrop-blur-sm">
            <FiTool />
          </div>

          <h2 className="mt-7 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            Ready to Fix What's Broken?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
            Don't let a broken device or appliance disrupt your day.
            Find a trusted technician and get your repair journey started
            with FixMate.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/services"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:bg-blue-50"
            >
              Find a Technician
              <FiArrowRight />
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white/20"
            >
              Join as Technician
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-medium text-blue-100">
            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-green-300" />
              Easy Booking
            </span>

            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-green-300" />
              Trusted Professionals
            </span>

            <span className="flex items-center gap-2">
              <FiCheckCircle className="text-green-300" />
              Secure Payments
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
