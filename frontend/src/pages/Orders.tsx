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
} from "lucide-react";
import api from "../services/api";

interface Order {
  id: string;
  total_amount: string;
  status: string;
  payment_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/api/orders");
        setOrders(response.data.orders);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // ----------------------------------------
  // LOADING
  // ----------------------------------------
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-2xl backdrop-blur-sm">
            {/* LOADING ICON */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              {/* Outer glow */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl" />

              {/* Icon container */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
                <LoaderCircle
                  size={42}
                  strokeWidth={2}
                  className="animate-spin text-blue-600"
                />
              </div>
            </div>

            {/* HEADING */}
            <h2 className="mt-7 text-xl font-bold text-slate-800">
              Loading Your Orders
            </h2>

            {/* MESSAGE */}
            <p className="mt-2 text-sm text-slate-500">
              We're fetching your order history
            </p>

            {/* ANIMATED DOTS */}
            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" />
            </div>

            {/* SMALL FOOTER */}
            <p className="mt-6 text-xs font-medium text-slate-400">
              Please wait a moment...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ----------------------------------------
  // ERROR
  // ----------------------------------------
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

                <p className="mt-1 text-sm text-red-600">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* =========================================
            PAGE HEADER
        ========================================= */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            {/* ICON */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Package size={25} className="text-white" />
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
              My Orders
            </h1>

            {/* COUNT BADGE */}
            <span className="relative -bottom-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-sm font-bold text-white shadow-md">
              {orders.length}
            </span>
          </div>

          <p className="mt-3 text-slate-600">
            View your orders, payment status and order details
          </p>
        </div>

        {/* =========================================
            EMPTY ORDERS
        ========================================= */}
        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
            {/* ICON */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
              <ShoppingBag
                size={48}
                strokeWidth={1.8}
                className="text-purple-600"
              />
            </div>

            {/* HEADING */}
            <h2 className="mt-7 text-3xl font-bold text-slate-800 sm:text-4xl">
              No Orders Yet
            </h2>

            {/* MESSAGE */}
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              You haven't placed any orders yet. Explore our products and
              discover something you'll love!
            </p>

            {/* BUTTON */}
            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              <ShoppingBag size={19} />
              Start Shopping
              <ArrowRight size={18} />
            </Link>

            <p className="mt-5 text-xs text-slate-400">
              Your orders will appear here after checkout.
            </p>
          </div>
        ) : (
          /* =========================================
              ORDERS LIST
          ========================================= */
          <div className="space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* TOP GRADIENT BAR */}
                <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

                <div className="p-5 sm:p-6">
                  {/* =================================
                      ORDER HEADER
                  ================================= */}
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* ORDER ID */}
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <Package size={21} className="text-blue-600" />
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
                          {new Date(order.created_at).toLocaleString("en-IN", {
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

                  {/* =================================
                      ORDER INFORMATION
                  ================================= */}
                  <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                    {/* TOTAL */}
                    <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-blue-600" />

                        <p className="text-sm font-medium text-slate-500">
                          Total Amount
                        </p>
                      </div>

                      <p className="mt-2 text-2xl font-bold text-blue-700">
                        ₦{Number(order.total_amount).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* ORDER STATUS */}
                    <div className="rounded-xl bg-slate-50 p-4">
                      <p className="text-sm font-medium text-slate-500">
                        Order Status
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        {order.status.toLowerCase() === "delivered" ? (
                          <CircleCheck size={19} className="text-green-600" />
                        ) : order.status.toLowerCase() === "cancelled" ? (
                          <XCircle size={19} className="text-red-600" />
                        ) : (
                          <Clock3 size={19} className="text-orange-500" />
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
                            order.payment_status.toLowerCase() === "paid"
                              ? "bg-green-100 text-green-700"
                              : order.payment_status.toLowerCase() === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* =================================
                      FOOTER
                  ================================= */}
                  <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">
                      Order placed successfully
                    </p>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg sm:w-auto"
                    >
                      View Order Details
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
