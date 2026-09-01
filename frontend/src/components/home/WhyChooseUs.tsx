import { ShieldCheck, Clock3, Globe2, BadgeDollarSign } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted & Reliable",
    text: "We work with verified suppliers and manufacturers to guarantee quality and reliability.",
  },
  {
    icon: Clock3,
    title: "Fast Delivery",
    text: "Efficient shipping and customs processes ensure your goods arrive on time.",
  },
  {
    icon: Globe2,
    title: "Global Network",
    text: "Strong sourcing partnerships across China with reliable freight solutions to Ghana.",
  },
  {
    icon: BadgeDollarSign,
    title: "Competitive Pricing",
    text: "We negotiate directly with suppliers to save you money on every shipment.",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <p className="font-semibold uppercase tracking-widest text-yellow-500">
            Why Choose Us
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900 sm:text-5xl">
            Your Trusted Partner in Global Logistics
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Deblessco Logistics simplifies international sourcing, freight
            forwarding, customs clearance, and last-mile delivery, making global
            trade easy, transparent, and affordable.
          </p>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative">
            <img
              src="/images/logistics/why-choose-us.jpg"
              alt="Container Port"
              className="w-full rounded-3xl object-cover shadow-2xl"
            />

            <div className="absolute -bottom-6 right-4 rounded-2xl bg-white p-5 shadow-xl sm:-right-8 sm:p-6">
              <h3 className="text-4xl font-bold text-[#0F2D5C]">8+</h3>

              <p className="text-gray-600">Logistics Services</p>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-7">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={index}
                  className="flex gap-4 rounded-2xl bg-white p-5 shadow-lg transition hover:shadow-xl sm:gap-5 sm:p-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 sm:h-16 sm:w-16">
                    <Icon className="text-[#0F2D5C]" size={30} />
                  </div>

                  <div>
                    <h3 className="mb-2 text-xl font-bold sm:text-2xl">
                      {feature.title}
                    </h3>

                    <p className="leading-7 text-gray-600">{feature.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
