import { Search, Factory, Handshake, Ship, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Request Your Product",
    description:
      "Tell us the products you need, quantities, and specifications. Our team immediately begins sourcing reliable suppliers.",
    icon: Search,
  },
  {
    number: "02",
    title: "Source & Verify",
    description:
      "We identify trusted manufacturers and wholesalers while verifying quality, authenticity, and supplier credibility.",
    icon: Factory,
  },
  {
    number: "03",
    title: "Negotiate Best Prices",
    description:
      "Our experienced sourcing team negotiates directly with suppliers to secure competitive prices for your business.",
    icon: Handshake,
  },
  {
    number: "04",
    title: "Shipping & Customs",
    description:
      "We coordinate sea or air freight, documentation, customs clearance, and shipment tracking from China.",
    icon: Ship,
  },
  {
    number: "05",
    title: "Delivery in Ghana",
    description:
      "Your products arrive safely at your warehouse, shop, or doorstep anywhere in Ghana.",
    icon: Truck,
  },
];

const stats = [
  {
    value: "100+",
    title: "Products Sourced",
  },
  {
    value: "100%",
    title: "Transparent Process",
  },
  {
    value: "China 🇨🇳",
    title: "Direct Sourcing",
  },
  {
    value: "Ghana 🇬🇭",
    title: "Reliable Delivery",
  },
];

export default function HowItWorks() {
  return (
    <section id="process" className="scroll-mt-24 bg-white py-6">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <span className="rounded-full bg-yellow-100 px-5 py-2 text-sm font-semibold text-yellow-700">
            Our Process
          </span>

          <h2 className="mt-6 text-4xl font-bold text-[#0F274D] sm:text-5xl">
            How It Works
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            We simplify international sourcing by managing every stage of the
            process—from finding trusted suppliers in China to delivering your
            products safely to Ghana.
          </p>
        </div>

        <div className="relative mt-20">
          {/* Timeline */}
          <div className="absolute left-0 right-0 top-10 hidden h-1 rounded-full bg-yellow-400 lg:block" />

          <div className="grid gap-8 lg:grid-cols-5">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  <div className="flex justify-center">
                    <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#0F274D] shadow-xl">
                      <Icon className="h-9 w-9 text-white" />
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl sm:p-8">
                    <span className="text-sm font-bold tracking-widest text-yellow-500">
                      STEP {step.number}
                    </span>

                    <h3 className="mt-3 text-xl font-bold text-[#0F274D] sm:text-2xl">
                      {step.title}
                    </h3>

                    <p className="mt-4 leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-24 rounded-[32px] bg-[#0F274D] px-6 py-12 sm:px-10 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.title} className="text-center">
                <h3 className="text-4xl font-bold text-yellow-400 sm:text-5xl">
                  {stat.value}
                </h3>

                <p className="mt-4 text-lg text-slate-300">{stat.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
