import Link from "next/link";
import {
  FiSmartphone,
  FiMonitor,
  FiWind,
  FiBox,
  FiTv,
  FiDroplet,
  FiZap,
  FiArrowUpRight,
} from "react-icons/fi";

const categories = [
  {
    name: "Smartphone",
    description: "Screen, battery and hardware repair.",
    icon: FiSmartphone,
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Laptop & PC",
    description: "Hardware and software solutions.",
    icon: FiMonitor,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    name: "AC",
    description: "Cooling, servicing and maintenance.",
    icon: FiWind,
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "Refrigerator",
    description: "Cooling and refrigerator repair.",
    icon: FiBox,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "TV",
    description: "Display, sound and TV repair.",
    icon: FiTv,
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "Washing Machine",
    description: "Installation and machine repair.",
    icon: FiDroplet,
    color: "bg-sky-50 text-sky-600",
  },
  {
    name: "Electrical",
    description: "Professional electrical solutions.",
    icon: FiZap,
    color: "bg-amber-50 text-amber-600",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            What We Repair
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Explore Our Repair Services
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            From everyday devices to essential home appliances, find the
            right repair solution with FixMate.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                href="/services"
                key={category.name}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${category.color}`}
                >
                  <Icon />
                </div>

                <h3 className="mt-6 text-lg font-extrabold text-slate-900 transition group-hover:text-blue-600">
                  {category.name}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {category.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-600">
                  Explore Service
                  <FiArrowUpRight className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Button */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            View All Services
            <FiArrowUpRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
