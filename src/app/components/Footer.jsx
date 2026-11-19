
import Link from "next/link";
import {
  FiArrowRight,
  FiMapPin,
  FiTool,
  FiMail,
  FiPhone,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
              <FiTool />
            </div>

            <span className="text-2xl font-extrabold text-white">
              Fix<span className="text-blue-400">Mate</span>
            </span>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
            Your trusted platform for finding reliable repair services
            and connecting with professional technicians.
          </p>

          <div className="mt-6 flex gap-3">
            <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-lg transition hover:bg-blue-600 hover:text-white">
              <FiFacebook />
            </a>
            <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-lg transition hover:bg-blue-600 hover:text-white">
              <FiInstagram />
            </a>
            <a href="#" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-lg transition hover:bg-blue-600 hover:text-white">
              <FiLinkedin />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-6 font-extrabold text-white">
            Quick Links
          </h3>

          <ul className="space-y-4 text-sm text-slate-400">
            <li>
              <Link href="/" className="transition hover:text-blue-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/services" className="transition hover:text-blue-400">
                Services
              </Link>
            </li>
            <li>
              <Link href="/#how-it-works" className="transition hover:text-blue-400">
                How It Works
              </Link>
            </li>
            <li>
              <Link href="/#why-fixmate" className="transition hover:text-blue-400">
                Why FixMate
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="mb-6 font-extrabold text-white">
            Our Services
          </h3>

          <ul className="space-y-4 text-sm text-slate-400">
            <li>Smartphone Repair</li>
            <li>Laptop & PC Repair</li>
            <li>AC Repair</li>
            <li>Refrigerator Repair</li>
            <li>TV Repair</li>
            <li>Electrical Services</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-6 font-extrabold text-white">
            Get In Touch
          </h3>

          <p className="mb-5 text-sm leading-7 text-slate-400">
            Have a repair need? Join FixMate and find the right technician.
          </p>

          <div className="space-y-4 text-sm text-slate-400">
            <div className="flex items-center gap-3">
              <FiMail className="shrink-0 text-blue-400" />
              <span>Contact through FixMate</span>
            </div>

            <div className="flex items-center gap-3">
              <FiPhone className="shrink-0 text-blue-400" />
              <span>Customer Support</span>
            </div>

            <div className="flex items-center gap-3">
              <FiMapPin className="shrink-0 text-blue-400" />
              <span>Repair services made simple</span>
            </div>
          </div>

          <Link
            href="/register"
            className="mt-7 inline-flex items-center gap-2 font-bold text-blue-400 transition hover:text-blue-300"
          >
            Join FixMate <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center text-xs text-slate-500 sm:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} FixMate. All rights reserved.
          </p>
          <p>Made for a better repair experience.</p>
        </div>
      </div>
    </footer>
  );
}
