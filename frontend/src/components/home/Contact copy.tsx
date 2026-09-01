import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
} from "lucide-react";
//import Swal from "sweetalert2";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    shipping: "",
    size: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      "Quote Request - Deblessco Logistics"
    );

    const body = encodeURIComponent(`Hello Deblessco Logistics,

I would like to request a quotation.

-----------------------------------

Name:
${form.name}

Email:
${form.email}

Phone:
${form.phone}

Company:
${form.company || "N/A"}

Service Required:
${form.service}

Shipping Method:
${form.shipping}

Estimated Shipment Size:
${form.size}

Shipment Details:
${form.message}

-----------------------------------

Kind Regards,
${form.name}
`);

    window.location.href = `mailto:deblesscologistics@gmail.com?subject=${subject}&body=${body}`;
  };

  const inputStyle =
    "w-full rounded-2xl border-2 border-slate-200 px-5 py-4 outline-none transition duration-300 focus:border-[#FFC107] focus:ring-4 focus:ring-yellow-100";

  return (
    <section
      id="contact"
      className="bg-slate-50 py-24"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="text-center mb-16">

          <p className="text-[#FFC107] font-semibold uppercase tracking-widest">
            Contact Us
          </p>

          <h2 className="text-4xl lg:text-5xl font-bold text-[#0F2347] mt-3">
            Let&apos;s Discuss Your Shipping Needs
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-lg text-slate-600">
            Need help sourcing products from China or shipping to Ghana?
            Send us your request and our logistics specialists will
            respond within 24 hours.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* LEFT */}

          <div className="space-y-6">

            <div className="flex gap-5 rounded-3xl bg-white p-6 shadow-md">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC107]">
                <Phone className="text-[#0F2347]" size={30} />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-[#0F2347]">
                  Call / WhatsApp
                </h3>

                <a
                  href="tel:+233205300810"
                  className="block mt-2 text-slate-600 hover:text-[#0057D9]"
                >
                  +233 20 530 0810
                </a>

                <a
                  href="https://wa.me/233205300810"
                  target="_blank"
                  className="block text-slate-600 hover:text-green-600"
                >
                  WhatsApp Us
                </a>

                <a
                  href="tel:+861570085440"
                  className="block mt-2 text-slate-600 hover:text-[#0057D9]"
                >
                  +86 157 008 5440
                </a>

              </div>

            </div>

            <div className="flex gap-5 rounded-3xl bg-white p-6 shadow-md">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC107]">
                <Mail className="text-[#0F2347]" size={30} />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-[#0F2347]">
                  Email
                </h3>

                <a
                  href="mailto:deblesscologistics@gmail.com"
                  className="mt-2 block text-slate-600 hover:text-[#0057D9]"
                >
                  deblesscologistics@gmail.com
                </a>

              </div>

            </div>

            <div className="flex gap-5 rounded-3xl bg-white p-6 shadow-md">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC107]">
                <MapPin className="text-[#0F2347]" size={30} />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-[#0F2347]">
                  Office
                </h3>

                <p className="mt-2 text-slate-600">
                  Accra, Ghana
                </p>

              </div>

            </div>

            <div className="flex gap-5 rounded-3xl bg-white p-6 shadow-md">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC107]">
                <Clock className="text-[#0F2347]" size={30} />
              </div>

              <div>

                <h3 className="text-2xl font-bold text-[#0F2347]">
                  Working Hours
                </h3>

                <p className="mt-2 text-slate-600">
                  Monday - Saturday
                </p>

                <p className="text-slate-600">
                  8:00 AM - 6:00 PM
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="rounded-3xl bg-white p-8 shadow-xl">

            <h3 className="text-4xl font-bold text-[#0F2347]">
              Request a Free Quote
            </h3>

            <p className="mt-4 text-slate-600">
              Tell us what you need and our team will prepare the
              best sourcing and shipping solution for you.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >

              <input
                name="name"
                placeholder="Your Name"
                required
                className={inputStyle}
                onChange={handleChange}
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address"
                required
                className={inputStyle}
                onChange={handleChange}
              />

              <input
                name="phone"
                placeholder="Phone Number"
                required
                className={inputStyle}
                onChange={handleChange}
              />

              <input
                name="company"
                placeholder="Company Name (Optional)"
                className={inputStyle}
                onChange={handleChange}
              />

              <select
                name="service"
                required
                className={inputStyle}
                onChange={handleChange}
              >
                <option value="">Select Required Service</option>
                <option>Product Sourcing</option>
                <option>Supplier Verification</option>
                <option>Price Negotiation</option>
                <option>Freight Forwarding</option>
                <option>Customs Clearance</option>
                <option>Door-to-Door Delivery</option>
                <option>Complete Import Assistance</option>
                <option>Other</option>
              </select>

              <select
                name="shipping"
                className={inputStyle}
                onChange={handleChange}
              >
                <option value="">Shipping Method</option>
                <option>Sea Freight</option>
                <option>Air Freight</option>
                <option>Not Sure Yet</option>
              </select>

              <select
                name="size"
                className={inputStyle}
                onChange={handleChange}
              >
                <option value="">Estimated Shipment Size</option>
                <option>Small Package</option>
                <option>Less than 100kg</option>
                <option>100kg - 500kg</option>
                <option>500kg - 1 Ton</option>
                <option>1 Full Container</option>
                <option>Multiple Containers</option>
              </select>

              <textarea
                name="message"
                rows={6}
                required
                placeholder="Tell us about your shipment..."
                className={`${inputStyle} resize-none`}
                onChange={handleChange}
              />

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFC107] py-4 text-lg font-semibold text-[#0F2347] transition hover:bg-[#e6ad00]"
              >
                <Send size={20} />
                Request Free Quote
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}