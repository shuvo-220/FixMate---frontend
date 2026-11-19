import Link from "next/link";
import {
  FiSearch,
  FiCalendar,
  FiTool,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const steps = [
  {
    number: "01",
    title: "Find a Service",
    description:
      "Browse repair categories and discover the service that matches your problem.",
    icon: FiSearch,
  },
  {
    number: "02",
    title: "Book a Technician",
    description:
      "Choose a professional technician and submit your repair booking request.",
    icon: FiCalendar,
  },
  {
    number: "03",
    title: "Get It Repaired",
    description:
      "Your technician accepts the request and completes the repair service.",
    icon: FiTool,
  },
  {
    number: "04",
    title: "Complete Payment",
    description:
      "After the repair is completed, securely pay for your service online.",
    icon: FiCheckCircle,
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 bg-slate-50 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Simple Process
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            How FixMate Works
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Getting your device or home appliance repaired has never been
            easier. Follow these simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative rounded-2xl border border-slate-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                    <Icon />
                  </div>

                  <span className="text-4xl font-extrabold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-7 text-xl font-extrabold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {step.description}
                </p>

                {step.number !== "04" && (
                  <div className="absolute -right-5 top-12 z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white text-blue-600 shadow-sm lg:flex">
                    <FiArrowRight />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
          >
            Get Started Now
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
