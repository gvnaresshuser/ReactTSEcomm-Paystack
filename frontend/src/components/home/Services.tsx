import {
  Package,
  Factory,
  Handshake,
  Ship,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Product Sourcing",
    description:
      "Find trusted manufacturers and wholesalers across China for products that match your business needs.",
    tag: "Retail & Wholesale",
  },
  {
    icon: Factory,
    title: "Supplier Verification",
    description:
      "We verify factories and suppliers before you buy, reducing risk and ensuring quality.",
    tag: "Quality Assurance",
  },
  {
    icon: Handshake,
    title: "Price Negotiation",
    description:
      "Our experienced team negotiates directly with manufacturers to secure the best possible prices.",
    tag: "Cost Saving",
  },
  {
    icon: Ship,
    title: "Freight Forwarding",
    description:
      "Reliable air and sea freight solutions from China to Ghana with complete shipment coordination.",
    tag: "Worldwide Shipping",
  },
  {
    icon: ShieldCheck,
    title: "Customs Clearance",
    description:
      "We handle customs documentation and import procedures for smooth delivery into Ghana.",
    tag: "Fast Clearance",
  },
  {
    icon: Truck,
    title: "Door-to-Door Delivery",
    description:
      "From the supplier's warehouse in China directly to your doorstep in Ghana.",
    tag: "End-to-End Service",
  },
];

export default function Services() {
  return (
    <section id="services" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-yellow-100 px-5 py-2 text-sm font-semibold text-yellow-700">
            Our Services
          </span>

          <h2 className="mt-6 text-4xl font-bold text-[#0F274D] sm:text-5xl">
            Complete Logistics Solutions
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            From sourcing quality products in China to delivering them safely to
            your doorstep in Ghana, Deblessco Logistics manages every stage of
            the supply chain with professionalism and transparency.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:border-[#0F274D] hover:shadow-2xl"
              >
                <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 transition group-hover:bg-[#0F274D]">
                  <Icon className="h-10 w-10 text-[#0F274D] transition group-hover:text-white" />
                </div>

                <h3 className="text-2xl font-bold text-[#0F274D] sm:text-3xl">
                  {service.title}
                </h3>

                <p className="mt-5 leading-8 text-slate-600">
                  {service.description}
                </p>

                <div className="mt-10 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600">
                    {service.tag}
                  </span>

                  <span className="flex items-center gap-2 font-semibold text-[#0F274D] transition group-hover:text-yellow-500">
                    Learn More
                    <ArrowRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
