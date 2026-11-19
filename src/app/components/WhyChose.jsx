import {
  FiShield,
  FiUsers,
  FiClock,
  FiCreditCard,
  FiHeadphones,
  FiCheckCircle,
} from "react-icons/fi";

const features = [
  {
    icon: FiShield,
    title: "Verified Technicians",
    description:
      "Connect with technicians whose services are reviewed and approved by our platform.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FiUsers,
    title: "Easy Booking",
    description:
      "Find the right repair service and submit your booking request with just a few clicks.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: FiClock,
    title: "Convenient Service",
    description:
      "Manage your repair requests and track service progress from your account.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: FiCreditCard,
    title: "Secure Online Payment",
    description:
      "Complete your payment securely after your repair service is finished.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: FiHeadphones,
    title: "Multiple Repair Categories",
    description:
      "Find solutions for smartphones, computers and essential home appliances.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: FiCheckCircle,
    title: "Transparent Process",
    description:
      "Stay informed about your booking status from request submission to completion.",
    color: "bg-amber-50 text-amber-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section
      id="why-fixmate"
      className="scroll-mt-20 bg-white py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Section Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-blue-600">
            Why Choose Us
          </span>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Why People Choose FixMate
          </h2>

          <p className="mt-4 text-base leading-7 text-slate-600">
            We make finding repair services easier with a simple booking
            process, professional technicians and secure payments.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-100 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${feature.color}`}
                >
                  <Icon />
                </div>

                <h3 className="mt-6 text-lg font-extrabold text-slate-900 transition group-hover:text-blue-600">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
