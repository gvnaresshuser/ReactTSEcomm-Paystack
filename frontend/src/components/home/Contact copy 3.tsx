import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import Swal from "sweetalert2";

interface QuoteForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  shipping: string;
  size: string;
  message: string;
}

const initialForm: QuoteForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  service: "",
  shipping: "",
  size: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState<QuoteForm>(initialForm);
  const [loading, setLoading] = useState(false);

  // =========================================
  // HANDLE INPUT CHANGE
  // =========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================
  // HANDLE FORM SUBMIT
  // =========================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

     const response = await fetch(
       `${import.meta.env.VITE_API_URL}/api/quote-requests`,
       {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           name: form.name,
           email: form.email,
           phone: form.phone,
           company: form.company,
           service: form.service,
           shipping: form.shipping,
           shipment_size: form.size,
           message: form.message,
         }),
       },
     );

     const data = await response.json();

     if (!response.ok) {
       throw new Error(data.message || "Failed to submit quote request");
     }


      // =========================================
      // SUCCESS
      // =========================================

  await Swal.fire({
    icon: "success",
    title: "Quote Request Sent!",
    html: `
    <div style="
      margin-top: 10px;
      font-size: 15px;
      line-height: 1.7;
      color: #64748b;
    ">
      <div style="
        display: inline-block;
        margin-bottom: 12px;
        padding: 6px 14px;
        border-radius: 999px;
        background: #fef3c7;
        color: #b45309;
        font-size: 12px;
        font-weight: 700;
      ">
        ✓ REQUEST RECEIVED
      </div>

      <br/>

      Thank you for choosing
      <strong style="color:#0057D9;">
        DEBLESSCO Logistics
      </strong>.

      <br/>

      Our logistics specialists will review your requirements
      and contact you
      <strong style="color:#0F2347;">
        within 24 hours.
      </strong>
    </div>
  `,
    confirmButtonText: "Continue",
    confirmButtonColor: "#0F2347",
    background: "#ffffff",
    color: "#0F2347",
    width: "440px",
    padding: "2rem",
    customClass: {
      popup: "rounded-3xl shadow-2xl",
      title: "font-extrabold",
      confirmButton: "rounded-xl px-7 py-3 font-bold",
    },
  });

      // Clear form
      setForm(initialForm);
    } catch (error) {
      console.error("Quote submission error:", error);

      // =========================================
      // ERROR
      // =========================================

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        confirmButtonText: "OK",
        confirmButtonColor: "#0F2347",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INPUT STYLE
  // =========================================

  const inputStyle =
    "w-full rounded-2xl border-2 border-slate-200 px-5 py-4 outline-none transition duration-300 focus:border-[#FFC107] focus:ring-4 focus:ring-yellow-100";

  return (
    <section id="contact" className="bg-slate-50 py-2 sm:py-8 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================
            SECTION HEADER
        ========================================== */}

        <div className="mb-16 text-center">
          <p className="font-semibold uppercase tracking-widest text-[#FFC107]">
            Contact Us
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-[#0F2347] sm:text-4xl lg:text-5xl">
            Let&apos;s Discuss Your Shipping Needs
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:mt-5 sm:text-lg">
            Need help sourcing products from China or shipping to Ghana? Send us
            your request and our logistics specialists will respond within 24
            hours.
          </p>
        </div>

        {/* =========================================
            CONTACT CONTENT
        ========================================== */}

        <div className="grid gap-16 lg:grid-cols-2">
          {/* =========================================
              LEFT SIDE - CONTACT INFORMATION
          ========================================== */}

          <div className="space-y-6">
            {/* PHONE */}

            <div className="flex w-full gap-4 rounded-3xl bg-white p-5 shadow-md sm:gap-5 sm:p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFC107] sm:h-16 sm:w-16">
                <Phone className="text-[#0F2347]" size={30} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0F2347]">
                  Call / WhatsApp
                </h3>

                <a
                  href="tel:+233205300810"
                  className="mt-2 block text-slate-600 transition hover:text-[#0057D9]"
                >
                  +233 20 530 0810
                </a>

                <a
                  href="https://wa.me/233205300810"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-slate-600 transition hover:text-green-600"
                >
                  WhatsApp Us
                </a>

                <a
                  href="tel:+861570085440"
                  className="mt-2 block text-slate-600 transition hover:text-[#0057D9]"
                >
                  +86 157 008 5440
                </a>
              </div>
            </div>

            {/* EMAIL */}

            <div className="flex gap-5 rounded-3xl bg-white p-6 shadow-md">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFC107]">
                <Mail className="text-[#0F2347]" size={30} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0F2347]">Email</h3>

                <a
                  href="mailto:deblesscologistics@gmail.com"
                  className="mt-2 block text-slate-600 transition hover:text-[#0057D9]"
                >
                  deblesscologistics@gmail.com
                </a>
              </div>
            </div>

            {/* OFFICE */}

            <div className="flex gap-5 rounded-3xl bg-white p-6 shadow-md">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFC107]">
                <MapPin className="text-[#0F2347]" size={30} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0F2347]">Office</h3>

                <p className="mt-2 text-slate-600">Accra, Ghana</p>
              </div>
            </div>

            {/* WORKING HOURS */}

            <div className="flex gap-5 rounded-3xl bg-white p-6 shadow-md">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#FFC107]">
                <Clock className="text-[#0F2347]" size={30} />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#0F2347]">
                  Working Hours
                </h3>

                <p className="mt-2 text-slate-600">Monday - Saturday</p>

                <p className="text-slate-600">8:00 AM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* =========================================
              RIGHT SIDE - QUOTE FORM
          ========================================== */}

          <div className="w-full rounded-3xl bg-white p-5 shadow-xl sm:p-8">
            <h3 className="text-3xl font-bold leading-tight text-[#0F2347] sm:text-4xl">
              Request a Free Quote
            </h3>

            <p className="mt-4 text-slate-600">
              Tell us what you need and our team will prepare the best sourcing
              and shipping solution for you.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {/* NAME */}

              <input
                name="name"
                value={form.name}
                placeholder="Your Name"
                required
                className={inputStyle}
                onChange={handleChange}
              />

              {/* EMAIL */}

              <input
                name="email"
                type="email"
                value={form.email}
                placeholder="Email Address"
                required
                className={inputStyle}
                onChange={handleChange}
              />

              {/* PHONE */}

              <input
                name="phone"
                value={form.phone}
                placeholder="Phone Number"
                required
                className={inputStyle}
                onChange={handleChange}
              />

              {/* COMPANY */}

              <input
                name="company"
                value={form.company}
                placeholder="Company Name (Optional)"
                className={inputStyle}
                onChange={handleChange}
              />

              {/* SERVICE */}

              <select
                name="service"
                value={form.service}
                required
                className={inputStyle}
                onChange={handleChange}
              >
                <option value="">Select Required Service</option>

                <option value="Product Sourcing">Product Sourcing</option>

                <option value="Supplier Verification">
                  Supplier Verification
                </option>

                <option value="Price Negotiation">Price Negotiation</option>

                <option value="Freight Forwarding">Freight Forwarding</option>

                <option value="Customs Clearance">Customs Clearance</option>

                <option value="Door-to-Door Delivery">
                  Door-to-Door Delivery
                </option>

                <option value="Complete Import Assistance">
                  Complete Import Assistance
                </option>

                <option value="Other">Other</option>
              </select>

              {/* SHIPPING */}

              <select
                name="shipping"
                value={form.shipping}
                className={inputStyle}
                onChange={handleChange}
              >
                <option value="">Shipping Method</option>

                <option value="Sea Freight">Sea Freight</option>

                <option value="Air Freight">Air Freight</option>

                <option value="Not Sure Yet">Not Sure Yet</option>
              </select>

              {/* SIZE */}

              <select
                name="size"
                value={form.size}
                className={inputStyle}
                onChange={handleChange}
              >
                <option value="">Estimated Shipment Size</option>

                <option value="Small Package">Small Package</option>

                <option value="Less than 100kg">Less than 100kg</option>

                <option value="100kg - 500kg">100kg - 500kg</option>

                <option value="500kg - 1 Ton">500kg - 1 Ton</option>

                <option value="1 Full Container">1 Full Container</option>

                <option value="Multiple Containers">Multiple Containers</option>
              </select>

              {/* MESSAGE */}

              <textarea
                name="message"
                value={form.message}
                rows={6}
                required
                placeholder="Tell us about your shipment..."
                className={`${inputStyle} resize-none`}
                onChange={handleChange}
              />

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#FFC107] py-4 text-lg font-semibold text-[#0F2347] shadow-md transition hover:bg-[#e6ad00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#0F2347] border-t-transparent" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Request Free Quote
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
