import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  CalendarDays,
  CreditCard,
  ArrowRight,
  LoaderCircle,
  CircleCheck,
  Clock3,
  XCircle,
  Search,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";

interface Order {
  id: string;
  total_amount: string;
  status: string;
  payment_status: string;
  payment_method: "Online" | "COD";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
}

const Orders = () => {
  // ========================================
  // ORDERS
  // ========================================

  const [orders, setOrders] = useState<Order[]>([]);

  // ========================================
  // LOADING + ERROR
  // ========================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // PAGINATION
  // ========================================

  const [page, setPage] = useState(1);

  // Number of orders displayed per page
  const [limit] = useState(10);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalOrders: 0,
    totalPages: 0,
  });

  // ========================================
  // SEARCH + DATE/TIME FILTERS
  // ========================================

  const [search, setSearch] = useState("");
  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");

  // Used to avoid calling the API for every
  // single character while typing.
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ========================================
  // DEBOUNCE SEARCH
  // ========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // ========================================
  // FETCH ORDERS
  // ========================================
  //
  // IMPORTANT:
  // The backend now performs:
  //
  // 1. Search
  // 2. Date filtering
  // 3. Pagination
  //
  // React receives ONLY the current page.
  //
  // Example:
  //
  // 1,00,000 orders in database
  //          ↓
  // PostgreSQL filtering
  //          ↓
  // LIMIT 10
  //          ↓
  // React receives 10 orders
  //
  // ========================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

       const response = await api.get("/api/orders/paginated", {
         params: {
           page,
           limit,
           search: debouncedSearch.trim(),
           fromDateTime,
           toDateTime,
         },
       });

       setOrders(response.data.orders);

       setPagination(response.data.pagination);

        setOrders(response.data.orders);

        setPagination(response.data.pagination);
      } catch (error: any) {
        setError(
          error.response?.data?.message || "Failed to fetch orders"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, debouncedSearch, fromDateTime, toDateTime]);

  // ========================================
  // RESET PAGE WHEN FILTER CHANGES
  // ========================================
  //
  // Example:
  //
  // User is on page 8
  // User searches "Delivered"
  //
  // We should go back to page 1.
  //
  // ========================================

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fromDateTime, toDateTime]);

  // ========================================
  // CLEAR FILTERS
  // ========================================

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setFromDateTime("");
    setToDateTime("");
    setPage(1);
  };

  // ========================================
  // PAGINATION INFORMATION
  // ========================================

  const totalOrders = pagination.totalOrders;
  const totalPages = pagination.totalPages;

  const startOrder =
    totalOrders === 0 ? 0 : (page - 1) * limit + 1;

  const endOrder = Math.min(page * limit, totalOrders);

  const hasFilters =
    search.trim() !== "" ||
    fromDateTime !== "" ||
    toDateTime !== "";

  // ========================================
  // GENERATE PAGE NUMBERS
  // ========================================
  //
  // Example:
  //
  // 1 ... 4 5 6 ... 100
  //
  // We don't display thousands of buttons.
  //
  // ========================================

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }

      return pages;
    }

    // Always show first page
    pages.push(1);

    // Left ellipsis
    if (page > 4) {
      pages.push("...");
    }

    // Pages around current page
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Right ellipsis
    if (page < totalPages - 3) {
      pages.push("...");
    }

    // Always show last page
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-2xl backdrop-blur-sm">
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
                <LoaderCircle
                  size={42}
                  strokeWidth={2}
                  className="animate-spin text-blue-600"
                />
              </div>
            </div>

            <h2 className="mt-7 text-xl font-bold text-slate-800">
              Loading Your Orders
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              We're fetching your order history
            </p>

            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" />
            </div>

            <p className="mt-6 text-xs font-medium text-slate-400">
              Please wait a moment...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-100 via-red-50 to-orange-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <XCircle className="text-red-600" size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Unable to load orders
                </h2>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // MAIN
  // ========================================

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* ========================================
            PAGE HEADER
        ======================================== */}

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Package size={25} className="text-white" />
            </div>

            <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
              My Orders
            </h1>

            <span className="relative -bottom-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-sm font-bold text-white shadow-md">
              {totalOrders.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="mt-3 text-slate-600">
            View your orders, payment status and order details
          </p>
        </div>

        {/* ========================================
            SEARCH + DATE/TIME FILTER
        ======================================== */}

        <div className="mb-5 rounded-2xl bg-white p-4 shadow-md sm:p-5">
          <div className="grid gap-3 md:grid-cols-3">

            {/* SEARCH */}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-600">
                Search Orders
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="Search order, status..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* FROM DATE & TIME */}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-600">
                From Date & Time
              </label>

              <input
                type="datetime-local"
                value={fromDateTime}
                onChange={(e) => {
                  setFromDateTime(e.target.value);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* TO DATE & TIME */}

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-600">
                To Date & Time
              </label>

              <input
                type="datetime-local"
                value={toDateTime}
                onChange={(e) => {
                  setToDateTime(e.target.value);
                }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* RESULTS + CLEAR */}

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-600">
              Showing{" "}
              <span className="font-bold text-blue-600">
                {startOrder.toLocaleString("en-IN")}-
                {endOrder.toLocaleString("en-IN")}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">
                {totalOrders.toLocaleString("en-IN")}
              </span>{" "}
              orders
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ========================================
            NO ORDERS / NO SEARCH RESULTS
        ======================================== */}

        {totalOrders === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
              {hasFilters ? (
                <Search
                  size={48}
                  strokeWidth={1.8}
                  className="text-purple-600"
                />
              ) : (
                <ShoppingBag
                  size={48}
                  strokeWidth={1.8}
                  className="text-purple-600"
                />
              )}
            </div>

            <h2 className="mt-7 text-3xl font-bold text-slate-800 sm:text-4xl">
              {hasFilters
                ? "No Matching Orders"
                : "No Orders Yet"}
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              {hasFilters
                ? "We couldn't find any orders matching your search or selected date and time."
                : "You haven't placed any orders yet. Explore our products and discover something you'll love!"}
            </p>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
              >
                <XCircle size={18} />
                Clear Filters
              </button>
            ) : (
              <Link
                to="/products"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
              >
                <ShoppingBag size={19} />
                Start Shopping
                <ArrowRight size={18} />
              </Link>
            )}

            {!hasFilters && (
              <p className="mt-5 text-xs text-slate-400">
                Your orders will appear here after checkout.
              </p>
            )}
          </div>
        ) : (
          <>
            {/* ========================================
                ORDERS
            ======================================== */}

            <div className="space-y-5">

              {orders.map((order) => (
                <article
                  key={order.id}
                  className="group overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* TOP GRADIENT */}

                  <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

                  <div className="p-5 sm:p-6">

                    {/* ORDER HEADER */}

                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      {/* ORDER ID */}

                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                          <Package
                            size={21}
                            className="text-blue-600"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Order ID
                          </p>

                          <p className="mt-1 break-all text-sm font-bold text-slate-800">
                            {order.id}
                          </p>
                        </div>
                      </div>

                      {/* DATE */}

                      <div className="flex items-center gap-2 text-left sm:text-right">
                        <CalendarDays
                          size={18}
                          className="shrink-0 text-purple-500"
                        />

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Order Date
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-700">
                            {new Date(
                              order.created_at
                            ).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ORDER INFORMATION */}

                    <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">

                      {/* TOTAL */}

                      <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                        <div className="flex items-center gap-2">
                          <CreditCard
                            size={18}
                            className="text-blue-600"
                          />

                          <p className="text-sm font-medium text-slate-500">
                            Total Amount
                          </p>
                        </div>

                        <p className="mt-2 text-2xl font-bold text-blue-700">
                          ₦
                          {Number(
                            order.total_amount
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* ORDER STATUS */}

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-500">
                          Order Status
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          {order.status.toLowerCase() ===
                          "delivered" ? (
                            <CircleCheck
                              size={19}
                              className="text-green-600"
                            />
                          ) : order.status.toLowerCase() ===
                            "cancelled" ? (
                            <XCircle
                              size={19}
                              className="text-red-600"
                            />
                          ) : (
                            <Clock3
                              size={19}
                              className="text-orange-500"
                            />
                          )}

                          <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold capitalize text-slate-700">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* PAYMENT STATUS */}

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-500">
                          Payment Status
                        </p>

                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                              order.payment_status.toLowerCase() ===
                              "paid"
                                ? "bg-green-100 text-green-700"
                                : order.payment_status.toLowerCase() ===
                                  "failed"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </div>

                      {/* PAYMENT METHOD */}

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-500">
                          Payment Method
                        </p>

                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                              order.payment_method === "COD"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.payment_method === "COD"
                              ? "Cash on Delivery"
                              : "Pay Online"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* FOOTER */}

                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">

                      <p className="text-xs text-slate-400">
                        Order placed successfully
                      </p>

                      <div className="flex flex-col gap-2 sm:flex-row">

                        {/* VIEW ORDER */}

                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg sm:w-auto"
                        >
                          View Order Details
                          <ArrowRight size={17} />
                        </Link>

                        {/* TRACK ORDER */}

                        {order.status ===
                          "OutForDelivery" && (
                          <Link
                            to={`/orders/${order.id}/tracking`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-50 px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 sm:w-auto"
                          >
                            <Truck size={17} />
                            Track Order
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* ========================================
                PAGINATION
            ======================================== */}

            {totalPages > 1 && (
              <div className="mt-8 rounded-2xl bg-white p-4 shadow-md sm:p-5">

                {/* DESKTOP / TABLET */}

                <div className="hidden items-center justify-between gap-4 sm:flex">

                  {/* RESULT COUNT */}

                  <p className="text-sm font-medium text-slate-600">
                    Showing{" "}
                    <span className="font-bold text-blue-600">
                      {startOrder.toLocaleString("en-IN")}-
                      {endOrder.toLocaleString("en-IN")}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-slate-800">
                      {totalOrders.toLocaleString("en-IN")}
                    </span>
                  </p>

                  {/* PAGINATION BUTTONS */}

                  <div className="flex items-center gap-1.5">

                    {/* PREVIOUS */}

                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() =>
                        setPage((previous) =>
                          Math.max(1, previous - 1)
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={17} />
                      Previous
                    </button>

                    {/* PAGE NUMBERS */}

                    {pageNumbers.map((pageNumber, index) => {
                      if (pageNumber === "...") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-sm font-semibold text-slate-400"
                          >
                            ...
                          </span>
                        );
                      }

                      const isActive =
                        pageNumber === page;

                      return (
                        <button
                          key={pageNumber}
                          type="button"
                          onClick={() =>
                            setPage(pageNumber as number)
                          }
                          className={`h-9 min-w-9 rounded-xl px-3 text-sm font-bold transition ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}

                    {/* NEXT */}

                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((previous) =>
                          Math.min(totalPages, previous + 1)
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight size={17} />
                    </button>
                  </div>
                </div>

                {/* MOBILE */}

                <div className="flex items-center justify-between gap-3 sm:hidden">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() =>
                      setPage((previous) =>
                        Math.max(1, previous - 1)
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={19} />
                  </button>

                  {/* PAGE INFO */}

                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">
                      Page {page} of {totalPages}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      {startOrder.toLocaleString("en-IN")}-
                      {endOrder.toLocaleString("en-IN")} of{" "}
                      {totalOrders.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() =>
                      setPage((previous) =>
                        Math.min(totalPages, previous + 1)
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight size={19} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Orders;

