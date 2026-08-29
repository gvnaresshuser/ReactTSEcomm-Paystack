import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Package,
  ArrowLeft,
  CalendarDays,
  CreditCard,
  CircleCheck,
  Clock3,
  XCircle,
  LoaderCircle,
  ShoppingBag,
  Receipt,
} from "lucide-react";
import api from "../services/api";

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  price: string;
  quantity: number;
  subtotal: string;
  created_at: string;
}

interface Order {
  id: string;
  total_amount: string;
  status: string;
  payment_status: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/api/orders/${id}`);
        setOrder(response.data.order);
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

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
              {/* Animated glow */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl" />

              {/* Icon container */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
                <LoaderCircle
                  size={42}
                  strokeWidth={2}
                  className="animate-spin text-purple-600"
                />
              </div>
            </div>

            {/* HEADING */}
            <h2 className="mt-7 text-xl font-bold text-slate-800">
              Loading Order Details
            </h2>

            {/* MESSAGE */}
            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're retrieving your order information
            </p>

            {/* ANIMATED DOTS */}
            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" />
            </div>

            {/* FOOTER MESSAGE */}
            <p className="mt-6 text-xs font-medium text-slate-400">
              Please wait a moment...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ----------------------------------------
  // ERROR / ORDER NOT FOUND
  // ----------------------------------------
  if (error || !order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-red-50 to-orange-50 px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl bg-white p-8 text-center shadow-xl sm:p-12">
            {/* ICON */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-red-100 to-orange-100 shadow-inner">
              <XCircle size={48} strokeWidth={1.8} className="text-red-500" />
            </div>

            {/* HEADING */}
            <h1 className="mt-7 text-3xl font-bold text-slate-800 sm:text-4xl">
              Order Not Found
            </h1>

            {/* MESSAGE */}
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              {error ||
                "Unable to find this order. It may no longer be available."}
            </p>

            {/* BUTTON */}
            <Link
              to="/orders"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ----------------------------------------
  // STATUS ICON
  // ----------------------------------------
  const getStatusIcon = () => {
    const status = order.status.toLowerCase();

    if (status === "delivered") {
      return <CircleCheck size={19} className="text-green-600" />;
    }

    if (status === "cancelled") {
      return <XCircle size={19} className="text-red-600" />;
    }

    return <Clock3 size={19} className="text-orange-500" />;
  };

  // ----------------------------------------
  // STATUS STYLE
  // ----------------------------------------
  const getStatusStyle = () => {
    const status = order.status.toLowerCase();

    if (status === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (status === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  // ----------------------------------------
  // PAYMENT STYLE
  // ----------------------------------------
  const getPaymentStyle = () => {
    const status = order.payment_status.toLowerCase();

    if (status === "paid") {
      return "bg-green-100 text-green-700";
    }

    if (status === "failed") {
      return "bg-red-100 text-red-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* =========================================
            PAGE HEADER
        ========================================= */}
        <div className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {/* TITLE */}
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Receipt size={25} className="text-white" />
              </div>

              <div className="min-w-0">
                <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                  Order Details
                </h1>

                <p className="mt-2 break-all text-sm text-slate-500">
                  Order ID: {order.id}
                </p>
              </div>
            </div>

            {/* BACK BUTTON */}
            <Link
              to="/orders"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md sm:w-auto"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </Link>
          </div>
        </div>

        {/* =========================================
            ORDER STATUS BANNER
        ========================================= */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-md">
          <div className="h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500" />

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                <Package size={22} className="text-blue-600" />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Order Status
                </p>

                <div className="mt-1 flex items-center gap-2">
                  {getStatusIcon()}

                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${getStatusStyle()}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={18} className="text-purple-500" />

              <span>
                {new Date(order.created_at).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================
            MAIN CONTENT
        ========================================= */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* =====================================
              ORDER ITEMS
          ===================================== */}
          <section className="overflow-hidden rounded-2xl bg-white shadow-md lg:col-span-2">
            {/* SECTION HEADER */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50 p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <ShoppingBag size={21} className="text-purple-600" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Order Items
                    </h2>

                    <p className="text-sm text-slate-500">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "product" : "products"}
                    </p>
                  </div>
                </div>

                {/* STATUS */}
                <span
                  className={`hidden rounded-full px-3 py-1 text-sm font-semibold capitalize sm:inline-block ${getStatusStyle()}`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* ITEMS */}
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-5 transition hover:bg-slate-50 sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    {/* PRODUCT ICON */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                      <Package size={27} className="text-blue-600" />
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold text-slate-800 sm:text-lg">
                        {item.product_name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        ₦{Number(item.price).toLocaleString("en-IN")} ×{" "}
                        {item.quantity}
                      </p>
                    </div>

                    {/* SUBTOTAL */}
                    <div className="text-right">
                      <p className="text-base font-bold text-slate-900 sm:text-lg">
                        ₦{Number(item.subtotal).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">Subtotal</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =====================================
              ORDER SUMMARY
          ===================================== */}
          <aside className="h-fit overflow-hidden rounded-2xl bg-white shadow-md">
            {/* HEADER */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <Receipt size={21} className="text-white" />
                </div>

                <h2 className="text-xl font-bold text-white">Order Summary</h2>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              {/* ORDER DATE */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={18} className="text-purple-500" />

                  <span className="text-sm text-slate-600">Order Placed</span>
                </div>

                <span className="text-right text-sm font-semibold text-slate-800">
                  {new Date(order.created_at).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* PAYMENT */}
              <div className="flex items-center justify-between border-b border-slate-100 py-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-blue-500" />

                  <span className="text-sm text-slate-600">Payment</span>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold ${getPaymentStyle()}`}
                >
                  {order.payment_status}
                </span>
              </div>

              {/* TOTAL */}
              <div className="mt-5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-800">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-blue-700">
                    ₦{Number(order.total_amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* PAYMENT ID */}
              {order.razorpay_payment_id && (
                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Payment ID
                  </p>

                  <p className="mt-2 break-all text-xs font-medium text-slate-600">
                    {order.razorpay_payment_id}
                  </p>
                </div>
              )}

              {/* BACK BUTTON */}
              <Link
                to="/orders"
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01] hover:shadow-lg"
              >
                <ArrowLeft size={17} />
                Back to Orders
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default OrderDetails;
