import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Truck,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

interface Delivery {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

const PartnerDashboard = () => {
  const partnerData = localStorage.getItem("partner");
  const partner = partnerData ? JSON.parse(partnerData) : null;

  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("partnerToken");

      const response = await api.get("/api/partner/deliveries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeliveries(response.data.deliveries || []);
    } catch (error) {
      console.error("Failed to load partner dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const totalDeliveries = deliveries.length;

  const pendingDeliveries = deliveries.filter(
    (delivery) => delivery.status === "Pending",
  ).length;

  const outForDelivery = deliveries.filter(
    (delivery) => delivery.status === "OutForDelivery",
  ).length;

  const delivered = deliveries.filter(
    (delivery) => delivery.status === "Delivered",
  ).length;

  const activeDelivery = deliveries.find(
    (delivery) =>
      delivery.status === "OutForDelivery" || delivery.status === "Pending",
  );

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">Delivery Partner</p>

          <h1 className="mt-1 text-2xl font-bold text-slate-800 sm:text-3xl">
            Welcome, {partner?.full_name || "Partner"} 👋
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your assigned deliveries and track your delivery progress.
          </p>
        </div>

        <button
          onClick={fetchDeliveries}
          disabled={loading}
          className="
            flex items-center justify-center gap-2
            rounded-xl
            bg-white
            px-4 py-3
            text-sm font-semibold
            text-slate-700
            shadow-sm
            ring-1 ring-slate-200
            transition
            hover:bg-slate-50
            disabled:opacity-50
          "
        >
          <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* STATUS CARD */}

      <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white shadow-xl sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-400" />

              <span className="text-sm font-semibold text-blue-100">
                You're Online
              </span>
            </div>

            <h2 className="text-xl font-bold sm:text-2xl">
              Ready for your next delivery?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100">
              View your assigned orders, start deliveries, and complete
              deliveries when you reach the customer.
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Truck size={32} />
          </div>
        </div>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* ASSIGNED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Assigned Orders
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "..." : totalDeliveries}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Package size={23} />
            </div>
          </div>
        </div>

        {/* PENDING */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Pending</p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "..." : pendingDeliveries}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Clock3 size={23} />
            </div>
          </div>
        </div>

        {/* OUT FOR DELIVERY */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Out for Delivery
              </p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "..." : outForDelivery}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <MapPin size={23} />
            </div>
          </div>
        </div>

        {/* DELIVERED */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Delivered</p>

              <p className="mt-2 text-3xl font-bold text-slate-800">
                {loading ? "..." : delivered}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <CheckCircle2 size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* DELIVERY INFORMATION */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* VEHICLE */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Truck size={22} />
            </div>

            <div>
              <h2 className="font-bold text-slate-800">My Vehicle</h2>

              <p className="text-xs text-slate-500">Registered vehicle</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">Vehicle Type</p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {partner?.vehicle_type || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-400">Vehicle Number</p>

              <p className="mt-1 text-sm font-semibold text-slate-700">
                {partner?.vehicle_number || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {/* CURRENT DELIVERY */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">Current Delivery</h2>

              <p className="mt-1 text-xs text-slate-500">
                Your active delivery
              </p>
            </div>

            <div
              className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                activeDelivery
                  ? "bg-blue-50 text-blue-600"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {activeDelivery ? "Active Delivery" : "No Active Delivery"}
            </div>
          </div>

          {activeDelivery ? (
            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <Package size={23} />
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Order
                    </p>

                    <p className="font-bold text-slate-800">
                      #{activeDelivery.id.slice(0, 8)}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {activeDelivery.status}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase text-slate-400">
                  Customer
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {activeDelivery.customer_name}
                </p>

                <p className="text-sm text-slate-500">
                  {activeDelivery.customer_email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                <CheckCircle2 size={27} />
              </div>

              <h3 className="font-semibold text-slate-700">
                No active delivery
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500">
                You have no pending or active delivery right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
