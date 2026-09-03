import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Package,  
  LoaderCircle,
  Search,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";

interface DeliveryPartner {
  id: string;
  full_name: string;
  phone: string;
  status: "active" | "inactive";
}

interface Order {
  id: string;
  user_name: string;
  user_email: string;
  total_amount: string;
  status: string;
  payment_status: string;
  created_at: string;

  delivery_partner_id: string | null;
  delivery_partner_name: string | null;
  delivery_partner_phone: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  totalOrders: number;
  totalPages: number;
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

  const [partners, setPartners] = useState<DeliveryPartner[]>([]);
  const [assigningOrderId, setAssigningOrderId] = useState<string | null>(null);

  // ============================================================
  // SEARCH + DATE/TIME FILTERS
  // ============================================================

  const [search, setSearch] = useState("");
  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");

  // ============================================================
  // PAGINATION
  // ============================================================

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalOrders: 0,
    totalPages: 0,
  });
  // Total number of orders across all pages
  const totalOrders = pagination.totalOrders;

  // ============================================================
  // FETCH DELIVERY PARTNERS
  // ============================================================

  const fetchPartners = async () => {
    try {
      const response = await api.get("/api/admin/delivery-partners");

      const activePartners = response.data.deliveryPartners.filter(
        (partner: DeliveryPartner) => partner.status === "active",
      );

      setPartners(activePartners);
    } catch (error) {
      console.error("Failed to load delivery partners:", error);
    }
  };

  // ============================================================
  // FETCH PAGINATED ORDERS
  // ============================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/admin/orders/paginated", {
        params: {
          page,
          limit,
          search: search.trim(),
          fromDateTime,
          toDateTime,
        },
      });

      setOrders(response.data.orders);

      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD + WHEN PAGE/FILTERS CHANGE
  // ============================================================

  useEffect(() => {
    fetchOrders();
  }, [page, search, fromDateTime, toDateTime]);

  // ============================================================
  // FETCH PARTNERS ONCE
  // ============================================================

  useEffect(() => {
    fetchPartners();
  }, []);

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/api/admin/orders/${id}/status`, {
        status,
      });

      // Refresh current page
      await fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // ============================================================
  // ASSIGN DELIVERY PARTNER
  // ============================================================

  const handleAssignPartner = async (orderId: string, partnerId: string) => {
    if (!partnerId) return;

    try {
      setAssigningOrderId(orderId);

      await api.put(`/api/admin/orders/${orderId}/delivery-partner`, {
        partnerId,
      });

      const partner = partners.find((item) => item.id === partnerId);

      // Update current page locally
      setOrders((current) =>
        current.map((order) =>
          order.id === orderId
            ? {
                ...order,
                delivery_partner_id: partnerId,
                delivery_partner_name: partner?.full_name || null,
                delivery_partner_phone: partner?.phone || null,
              }
            : order,
        ),
      );

      await Swal.fire({
        icon: "success",
        title: "Partner Assigned!",
        text: `${
          partner?.full_name || "Delivery partner"
        } has been assigned successfully.`,

        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,

        background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",

        color: "#ffffff",

        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-lg font-bold text-white",
          htmlContainer: "text-sm text-blue-50",
        },
      });
    } catch (error: any) {
      console.error("Assign delivery partner error:", error);

      await Swal.fire({
        icon: "error",
        title: "Assignment Failed",
        text:
          error.response?.data?.message || "Failed to assign delivery partner.",

        confirmButtonText: "OK",
        buttonsStyling: false,

        background: "linear-gradient(135deg, #991b1b, #dc2626, #ef4444)",

        color: "#ffffff",

        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold text-white",
          htmlContainer: "text-sm text-red-50",
          confirmButton:
            "rounded-xl bg-white px-6 py-3 text-sm font-semibold text-red-600",
        },
      });
    } finally {
      setAssigningOrderId(null);
    }
  };

  // ============================================================
  // FILTER HANDLING
  // ============================================================

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDateTime(e.target.value);
    setPage(1);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDateTime(e.target.value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setFromDateTime("");
    setToDateTime("");
    setPage(1);
  };

  const hasFilters =
    search.trim() !== "" || fromDateTime !== "" || toDateTime !== "";

  // ============================================================
  // PAGINATION HANDLERS
  // ============================================================

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (page < pagination.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading && orders.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-2rem)] w-full items-center justify-center px-4 sm:min-h-[calc(100vh-3rem)]">
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
              Loading Orders
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're fetching the latest orders for you
            </p>

            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" />
            </div>

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
        {/* =====================================================
            HEADER
        ===================================================== */}

        {/*  <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Admin Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track customer orders
          </p>
        </div> */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <Package size={25} className="text-white" />
            </div>

            <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
              Admin Orders
            </h1>

            <span className="relative -bottom-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-sm font-bold text-white shadow-md">
              {totalOrders.toLocaleString("en-IN")}
            </span>
          </div>

          <p className="mt-3 text-slate-600">
            Manage and track customer orders
          </p>
        </div>

        {/* =====================================================
            SEARCH / DATE FILTER PANEL
        ===================================================== */}

        <div className="mb-5 rounded-2xl bg-white p-4 shadow-md sm:p-5">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* SEARCH */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search Orders
              </label>

              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search name, email, status..."
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-slate-50 py-3 pl-10 pr-4 text-sm
                    text-slate-700 shadow-sm outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* FROM */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                From Date & Time
              </label>

              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500"
                />

                <input
                  type="datetime-local"
                  value={fromDateTime}
                  onChange={handleFromDateChange}
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-slate-50 py-3 pl-10 pr-3 text-sm
                    text-slate-700 shadow-sm outline-none
                    transition
                    focus:border-blue-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* TO */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                To Date & Time
              </label>

              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500"
                />

                <input
                  type="datetime-local"
                  value={toDateTime}
                  onChange={handleToDateChange}
                  className="
                    w-full rounded-xl border border-slate-200
                    bg-slate-50 py-3 pl-10 pr-3 text-sm
                    text-slate-700 shadow-sm outline-none
                    transition
                    focus:border-purple-400
                    focus:bg-white
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />
              </div>
            </div>
          </div>

          {/* FILTER FOOTER */}

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-bold text-blue-600">{orders.length}</span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.totalOrders}
              </span>{" "}
              {pagination.totalOrders === 1 ? "order" : "orders"}
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="
                  inline-flex items-center justify-center gap-2
                  rounded-lg bg-slate-100 px-4 py-2
                  text-sm font-semibold text-slate-600
                  transition hover:bg-slate-200
                "
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* =====================================================
            NO RESULTS
        ===================================================== */}

        {orders.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <Search size={42} className="mx-auto text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-700">
              No orders found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or date/time filters.
            </p>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="
                  mt-5 rounded-lg bg-blue-600
                  px-5 py-2.5 text-sm font-semibold
                  text-white transition hover:bg-blue-700
                "
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* =====================================================
            RESULTS
        ===================================================== */}

        {orders.length > 0 && (
          <>
            {/* =================================================
                DESKTOP TABLE
            ================================================= */}

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
                    <th className="p-4">Delivery Partner</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b transition hover:bg-slate-50"
                    >
                      {/* CUSTOMER */}

                      <td className="p-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {order.user_name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {order.user_email}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.id}
                        </p>
                      </td>

                      {/* DATE */}

                      <td className="p-4 text-sm text-slate-600">
                        {new Date(order.created_at).toLocaleString("en-IN")}
                      </td>

                      {/* TOTAL */}

                      <td className="p-4 font-semibold text-slate-800">
                        ₦{Number(order.total_amount).toLocaleString("en-IN")}
                      </td>

                      {/* PAYMENT */}

                      <td className="p-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStyle(
                            order.payment_status,
                          )}`}
                        >
                          {order.payment_status}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td className="p-4">
                        <span
                          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            order.status,
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* UPDATE STATUS */}

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

                      {/* DELIVERY PARTNER */}

                      <td className="px-4 py-4">
                        <select
                          value={order.delivery_partner_id || ""}
                          disabled={assigningOrderId === order.id}
                          onChange={(e) =>
                            handleAssignPartner(order.id, e.target.value)
                          }
                          className="
                            w-full min-w-[190px]
                            rounded-xl border border-slate-200
                            bg-slate-50 px-3 py-2
                            text-sm font-medium text-slate-700
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:bg-white
                            focus:ring-2
                            focus:ring-blue-100
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                          "
                        >
                          <option value="">Select Partner</option>

                          {partners.map((partner) => (
                            <option key={partner.id} value={partner.id}>
                              {partner.full_name} - {partner.phone}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =================================================
                MOBILE CARDS
            ================================================= */}

            <div className="space-y-4 md:hidden">
              {orders.map((order) => (
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

                  {/* ORDER ID */}

                  <div className="mt-4 border-t pt-4">
                    <p className="text-xs text-slate-500">Order ID</p>

                    <p className="mt-1 break-all text-xs font-medium text-slate-600">
                      {order.id}
                    </p>
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

                  {/* DELIVERY PARTNER */}

                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Delivery Partner
                    </label>

                    <select
                      value={order.delivery_partner_id || ""}
                      disabled={assigningOrderId === order.id}
                      onChange={(e) =>
                        handleAssignPartner(order.id, e.target.value)
                      }
                      className="
                        w-full rounded-xl
                        border border-slate-200
                        bg-slate-50 px-3 py-3
                        text-sm font-medium text-slate-700
                        outline-none
                        focus:border-blue-500
                        focus:bg-white
                        focus:ring-2
                        focus:ring-blue-100
                      "
                    >
                      <option value="">Select Delivery Partner</option>

                      {partners.map((partner) => (
                        <option key={partner.id} value={partner.id}>
                          {partner.full_name} - {partner.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            {pagination.totalPages > 1 && (
              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md sm:flex-row">
                {/* SUMMARY */}

                <p className="text-sm text-slate-500">
                  Page{" "}
                  <span className="font-semibold text-slate-800">
                    {pagination.page}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {pagination.totalPages}
                  </span>
                </p>

                {/* BUTTONS */}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousPage}
                    disabled={page === 1 || loading}
                    className="
                      inline-flex items-center gap-1
                      rounded-xl border border-slate-200
                      bg-white px-4 py-2.5
                      text-sm font-semibold text-slate-700
                      transition
                      hover:bg-slate-50
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>

                  <span
                    className="
                      rounded-xl bg-[#0F274D]
                      px-4 py-2.5
                      text-sm font-bold text-white
                    "
                  >
                    {page}
                  </span>

                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={page === pagination.totalPages || loading}
                    className="
                      inline-flex items-center gap-1
                      rounded-xl border border-slate-200
                      bg-white px-4 py-2.5
                      text-sm font-semibold text-slate-700
                      transition
                      hover:bg-slate-50
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};;

export default AdminOrders;