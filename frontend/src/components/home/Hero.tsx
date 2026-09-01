import { ArrowRight, PhoneCall, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero/hero-bg.jpg')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-[#0F2347]/70" />

      {/* Content */}
      {/* <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-32"> */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-10 pb-20 sm:pt-14 lg:pt-16">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-5 py-2 backdrop-blur-sm">
          <CheckCircle2 className="h-5 w-5 text-yellow-400" />

          <span className="text-sm font-semibold uppercase tracking-wider text-yellow-400">
            Trusted China → Ghana Logistics Partner
          </span>
        </div>

        {/* Heading */}
        <h1 className="max-w-4xl text-5xl font-extrabold leading-tight text-white sm:text-6xl md:text-7xl">
          Your Gateway to
          <br />
          <span className="text-yellow-400">Global Trade</span>
        </h1>

        {/* Description */}
        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl sm:leading-9">
          We help businesses source quality products from China, verify trusted
          suppliers, negotiate the best prices, manage shipping, customs
          clearance and deliver safely to Ghana.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-yellow-400 px-8 py-4 text-lg font-semibold text-[#0F2347] transition hover:scale-105 hover:bg-yellow-300"
          >
            Get Free Quote
            <ArrowRight size={22} />
          </a>

          <a
            href="https://wa.me/233205300810"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white transition hover:bg-white hover:text-[#0F2347]"
          >
            <PhoneCall size={22} />
            WhatsApp Us
          </a>
        </div>

        {/* Statistics */}
        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-white/20 pt-10 md:grid-cols-4">
          <div>
            <h3 className="text-4xl font-bold text-yellow-400">8+</h3>
            <p className="mt-2 text-slate-300">Logistics Services</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-yellow-400">100+</h3>
            <p className="mt-2 text-slate-300">Successful Shipments</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-yellow-400">50+</h3>
            <p className="mt-2 text-slate-300">Trusted Suppliers</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-yellow-400">24/7</h3>
            <p className="mt-2 text-slate-300">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
