import { useEffect, useState } from "react";
import api from "../../services/api";
import { LoaderCircle, Search } from "lucide-react";

interface Order {
  id: string;
  user_name: string;
  user_email: string;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;
}

const statuses = [
  "Pending",
  "Confirmed",
  "Packed",
  "OutForDelivery",
  "Delivered",
  "Cancelled",
];

const getStatusStyle = (status: string) => {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-blue-100 text-blue-700",
    Packed: "bg-purple-100 text-purple-700",
    OutForDelivery: "bg-orange-100 text-orange-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return styles[status] || "bg-slate-100 text-slate-700";
};

const getPaymentStyle = (status: string) => {
  const styles: Record<string, string> = {
    Paid: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Failed: "bg-red-100 text-red-700",
    Refunded: "bg-purple-100 text-purple-700",
  };

  return styles[status] || "bg-slate-100 text-slate-700";
};

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/admin/orders");
      setOrders(response.data.orders);
      console.log(response.data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  /* SEARCH */
  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      order.user_name.toLowerCase().includes(searchText) ||
      order.user_email.toLowerCase().includes(searchText) ||
      order.id.toLowerCase().includes(searchText) ||
      order.status.toLowerCase().includes(searchText) ||
      order.payment_status.toLowerCase().includes(searchText)
    );
  });

  /* LOADING */
  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-2rem)] w-full items-center justify-center px-4 sm:min-h-[calc(100vh-3rem)]">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-2xl backdrop-blur-sm">
            {/* ANIMATED LOADING ICON */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              {/* Animated Glow */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl" />

              {/* Icon Container */}
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
              Loading Orders
            </h2>

            {/* MESSAGE */}
            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're fetching the latest orders for you
            </p>

            {/* ANIMATED DOTS */}
            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" />
            </div>

            {/* FOOTER */}
            <p className="mt-6 text-xs font-medium text-slate-400">
              Almost there...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mx-auto max-w-7xl">
        {/* HEADER + SEARCH */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
          {/* TITLE */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Admin Orders
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage and track customer orders
            </p>
          </div>

          {/* SEARCH */}
          <div className="relative w-full lg:max-w-md">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, status, payment or order ID..."
              className="
                w-full rounded-xl border border-slate-200 bg-white
                py-3 pl-10 pr-4 text-sm text-slate-700
                shadow-sm outline-none transition
                placeholder:text-slate-400
                focus:border-blue-400 focus:ring-2 focus:ring-blue-100
              "
            />
          </div>
        </div>

        {/* RESULT COUNT */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredOrders.length}
            </span>{" "}
            {filteredOrders.length === 1 ? "order" : "orders"}
          </p>

          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* NO RESULTS */}
        {filteredOrders.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <Search size={42} className="mx-auto text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-700">
              No orders found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try searching with a different name, email or order ID.
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* RESULTS */}
        {filteredOrders.length > 0 && (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-md md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Order Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Update</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b transition hover:bg-slate-50"
                    >
                      <td className="p-4">
                        <p className="font-semibold text-sm text-slate-800">
                          {/* {order.user_name} */}
                          {order.id}
                        </p>

                        <p className="text-sm text-slate-500">
                          {order.user_email}
                        </p>
                      </td>

                      <td className="p-4 text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleString("en-IN")}
                      </td>

                      <td className="p-4 font-semibold text-slate-800">
                        ₦{Number(order.total_amount).toLocaleString("en-IN")}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStyle(
                            order.payment_status,
                          )}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold outline-none ${getStatusStyle(
                            order.status,
                          )}`}
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}
            <div className="space-y-4 md:hidden">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl bg-white p-4 shadow-md"
                >
                  {/* CUSTOMER + STATUS */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        {order.user_name}
                      </p>

                      <p className="truncate text-sm text-slate-500">
                        {order.user_email}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ORDER INFORMATION */}
                  <div className="mt-4 grid grid-cols-2 gap-4 border-t pt-4">
                    <div>
                      <p className="text-xs text-slate-500">Order Date</p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {new Date(order.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Total</p>

                      <p className="mt-1 font-semibold text-slate-800">
                        ₦{Number(order.total_amount).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* PAYMENT */}
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-slate-500">Payment</span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStyle(
                        order.payment_status,
                      )}`}
                    >
                      {order.payment_status}
                    </span>
                  </div>

                  {/* UPDATE STATUS */}
                  <div className="mt-4 border-t pt-4">
                    <p className="mb-2 text-sm font-medium text-slate-600">
                      Update Status
                    </p>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`w-full rounded-lg border px-3 py-2.5 text-sm font-semibold outline-none ${getStatusStyle(
                        order.status,
                      )}`}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;

