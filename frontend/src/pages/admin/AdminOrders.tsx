import { useEffect, useState } from "react";
import api from "../../services/api";

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

  const fetchOrders = async () => {
    try {
      const response = await api.get("/api/admin/orders");
      setOrders(response.data.orders);
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

  if (loading) {
    return <div className="p-4">Loading orders...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-5 text-2xl font-bold text-slate-800 sm:text-3xl">
          Admin Orders
        </h1>

        {/* Desktop Table */}
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
              {orders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="p-4">
                    <p className="font-semibold">{order.user_name}</p>
                    <p className="text-sm text-slate-500">{order.user_email}</p>
                  </td>

                  <td className="p-4">
                    {new Date(order.created_at).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4 font-semibold">
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
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold ${getStatusStyle(
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

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl bg-white p-4 shadow-md">
              {/* Customer + Status */}
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

              {/* Order Information */}
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

              {/* Payment */}
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

              {/* Update Status */}
              <div className="mt-4 border-t pt-4">
                <p className="mb-2 text-sm font-medium text-slate-600">
                  Update Status
                </p>

                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-sm font-semibold ${getStatusStyle(
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
      </div>
    </main>
  );
};

export default AdminOrders;
