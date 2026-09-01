import { useEffect, useState } from "react";
import {
  FileText,
  Search,
  Eye,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../services/api";

interface Quote {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  shipping: string | null;
  shipment_size: string | null;
  message: string;
  created_at: string;
}

const AdminQuotes = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // =========================================
  // FETCH QUOTES
  // =========================================

  const fetchQuotes = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/quote-requests");

      setQuotes(response.data.quotes || []);
    } catch (error) {
      console.error("Failed to fetch quote requests:", error);

      Swal.fire({
        icon: "error",
        title: "Unable to Load Quotes",
        text: "Something went wrong while loading quote requests.",
        confirmButtonColor: "#0F2347",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  // =========================================
  // FILTER QUOTES
  // =========================================

  const filteredQuotes = quotes.filter((quote) => {
    const searchText = search.toLowerCase();

    return (
      quote.name.toLowerCase().includes(searchText) ||
      quote.email.toLowerCase().includes(searchText) ||
      quote.phone.toLowerCase().includes(searchText) ||
      (quote.company || "").toLowerCase().includes(searchText) ||
      quote.service.toLowerCase().includes(searchText)
    );
  });

  // =========================================
  // VIEW QUOTE
  // =========================================

  const handleViewQuote = (quote: Quote) => {
    Swal.fire({
      title: "Quote Request Details",
      width: 650,
      confirmButtonText: "Close",
      confirmButtonColor: "#0F2347",

      html: `
        <div style="text-align:left;">

          <div style="
            background:linear-gradient(135deg,#eff6ff,#f5f3ff);
            padding:18px;
            border-radius:16px;
            margin-bottom:18px;
          ">

            <h3 style="
              margin:0 0 6px;
              color:#0F2347;
              font-size:20px;
              font-weight:700;
            ">
              ${quote.name}
            </h3>

            ${
              quote.company
                ? `<p style="margin:0;color:#64748b;">
                    ${quote.company}
                  </p>`
                : ""
            }

          </div>

          <div style="
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:12px;
            margin-bottom:18px;
          ">

            <div style="
              background:#f8fafc;
              padding:12px;
              border-radius:12px;
            ">
              <strong style="color:#64748b;font-size:12px;">
                EMAIL
              </strong>
              <div style="margin-top:4px;color:#0F2347;">
                ${quote.email}
              </div>
            </div>

            <div style="
              background:#f8fafc;
              padding:12px;
              border-radius:12px;
            ">
              <strong style="color:#64748b;font-size:12px;">
                PHONE
              </strong>
              <div style="margin-top:4px;color:#0F2347;">
                ${quote.phone}
              </div>
            </div>

            <div style="
              background:#fef3c7;
              padding:12px;
              border-radius:12px;
            ">
              <strong style="color:#92400e;font-size:12px;">
                SERVICE
              </strong>
              <div style="
                margin-top:4px;
                color:#78350f;
                font-weight:600;
              ">
                ${quote.service}
              </div>
            </div>

            <div style="
              background:#ecfdf5;
              padding:12px;
              border-radius:12px;
            ">
              <strong style="color:#047857;font-size:12px;">
                SHIPPING
              </strong>
              <div style="margin-top:4px;color:#065f46;">
                ${quote.shipping || "Not specified"}
              </div>
            </div>

            <div style="
              background:#f5f3ff;
              padding:12px;
              border-radius:12px;
            ">
              <strong style="color:#6d28d9;font-size:12px;">
                SHIPMENT SIZE
              </strong>
              <div style="margin-top:4px;color:#5b21b6;">
                ${quote.shipment_size || "Not specified"}
              </div>
            </div>

          </div>

          <div style="
            background:#f8fafc;
            padding:16px;
            border-radius:14px;
          ">

            <strong style="
              color:#0F2347;
              font-size:13px;
            ">
              SHIPMENT DETAILS
            </strong>

            <p style="
              margin:8px 0 0;
              color:#475569;
              line-height:1.6;
              white-space:pre-wrap;
            ">
              ${quote.message}
            </p>

          </div>

        </div>
      `,
    });
  };

  // =========================================
  // DATE FORMAT
  // =========================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <LoaderCircle
            size={45}
            className="mx-auto animate-spin text-blue-600"
          />

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            Loading Quote Requests
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please wait while we fetch the latest requests...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* =========================================
            HEADER
        ========================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
                <FileText size={24} />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                  Quote Requests
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage customer sourcing and shipping enquiries
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={fetchQuotes}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-md transition hover:bg-slate-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* =========================================
            SUMMARY
        ========================================== */}

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Total Requests</p>

                <p className="mt-2 text-3xl font-bold">{quotes.length}</p>
              </div>

              <FileText size={30} className="text-blue-200" />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-100">Showing</p>

                <p className="mt-2 text-3xl font-bold">
                  {filteredQuotes.length}
                </p>
              </div>

              <Search size={30} className="text-orange-100" />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-100">Latest Request</p>

                <p className="mt-2 text-sm font-bold">
                  {quotes.length > 0
                    ? formatDate(quotes[0].created_at)
                    : "No requests"}
                </p>
              </div>

              <CalendarDays size={30} className="text-emerald-100" />
            </div>
          </div>
        </div>

        {/* =========================================
            SEARCH
        ========================================== */}

        <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, company or service..."
              className="w-full rounded-xl border-2 border-slate-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* =========================================
            QUOTES TABLE
        ========================================== */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-md">
          {filteredQuotes.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <FileText size={35} className="text-slate-400" />
              </div>

              <h3 className="mt-5 text-xl font-bold text-slate-700">
                No Quote Requests Found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? "Try changing your search."
                  : "Customer quote requests will appear here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Service
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Shipping
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                      Date
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredQuotes.map((quote) => (
                    <tr
                      key={quote.id}
                      className="transition hover:bg-blue-50/50"
                    >
                      {/* CUSTOMER */}

                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 font-bold text-blue-700">
                            {quote.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-bold text-slate-800">
                              {quote.name}
                            </p>

                            {quote.company && (
                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                <Building2 size={13} />
                                {quote.company}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-5">
                        <div className="space-y-1">
                          <a
                            href={`mailto:${quote.email}`}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                          >
                            <Mail size={14} />
                            {quote.email}
                          </a>

                          <a
                            href={`tel:${quote.phone}`}
                            className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600"
                          >
                            <Phone size={14} />
                            {quote.phone}
                          </a>
                        </div>
                      </td>

                      {/* SERVICE */}

                      <td className="px-5 py-5">
                        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700">
                          {quote.service}
                        </span>
                      </td>

                      {/* SHIPPING */}

                      <td className="px-5 py-5">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">
                            {quote.shipping || "Not specified"}
                          </p>

                          {quote.shipment_size && (
                            <p className="mt-1 text-xs text-slate-500">
                              {quote.shipment_size}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* DATE */}

                      <td className="px-5 py-5">
                        <p className="text-sm text-slate-600">
                          {formatDate(quote.created_at)}
                        </p>
                      </td>

                      {/* ACTION */}

                      <td className="px-5 py-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleViewQuote(quote)}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-600 hover:text-white"
                        >
                          <Eye size={17} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminQuotes;
