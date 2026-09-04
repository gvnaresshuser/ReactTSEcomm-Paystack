import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LoaderCircle,
  Package,
  ShoppingCart,
  Clock,
  CircleCheck,
  //IndianRupee,
  Plus,
  ListOrdered,
  BarChart3,
} from "lucide-react";
import api from "../../services/api";
import NairaIcon from "../../components/Naira";

interface Dashboard {
  total_products: string;
  total_orders: string;
  pending_orders: string;
  paid_orders: string;
  total_sales: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/api/admin/dashboard");
        setDashboard(response.data.dashboard);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4">
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
              Loading Dashboard
            </h2>

            {/* MESSAGE */}
            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're preparing your dashboard for you
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
      </main>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  const totalOrders = Number(dashboard.total_orders);
  const paidOrders = Number(dashboard.paid_orders);
  const pendingOrders = Number(dashboard.pending_orders);
  const totalSales = Number(dashboard.total_sales);

  const paymentRate =
    totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0;

  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  const cards = [
    {
      title: "Total Products",
      value: Number(dashboard.total_products).toLocaleString("en-IN"),
      icon: Package,
      style: "bg-blue-100 text-blue-700",
      iconStyle: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString("en-IN"),
      icon: ShoppingCart,
      style: "bg-purple-100 text-purple-700",
      iconStyle: "bg-purple-50 text-purple-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString("en-IN"),
      icon: Clock,
      style: "bg-yellow-100 text-yellow-700",
      iconStyle: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Paid Orders",
      value: paidOrders.toLocaleString("en-IN"),
      icon: CircleCheck,
      style: "bg-green-100 text-green-700",
      iconStyle: "bg-green-50 text-green-600",
    },
    {
      title: "Total Sales",
      value: `₦${totalSales.toLocaleString("en-IN")}`,
      //icon: IndianRupee,
      icon: NairaIcon,
      style: "bg-orange-100 text-orange-700",
      iconStyle: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500 sm:text-base">
            Monitor your store performance and manage your business
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {card.title}
                    </p>

                    <p
                      className={`mt-3 inline-block rounded-lg px-4 py-2 text-xl font-bold sm:text-2xl ${card.style}`}
                    >
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconStyle}`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* BUSINESS SUMMARY */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* PAYMENT SUMMARY */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CircleCheck size={23} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">Payment Summary</h2>

                <p className="text-sm text-slate-500">
                  Order payment performance
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">
                  Paid Orders
                </span>

                <span className="text-sm font-bold text-green-600">
                  {paymentRate}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${paymentRate}%` }}
                />
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <span className="text-slate-500">{paidOrders} paid</span>

                <span className="text-slate-500">
                  {totalOrders} total orders
                </span>
              </div>
            </div>
          </div>

          {/* SALES SUMMARY */}
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <BarChart3 size={23} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">Sales Summary</h2>

                <p className="text-sm text-slate-500">
                  Your current store revenue
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-orange-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Total Sales
                </p>

                <p className="mt-2 text-lg font-bold text-orange-700">
                  ₦{totalSales.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-xs font-medium text-slate-500">
                  Avg. Order Value
                </p>

                <p className="mt-2 text-lg font-bold text-blue-700">
                  ₦
                  {averageOrderValue.toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ORDER OVERVIEW */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800">Order Overview</h2>

              <p className="mt-1 text-sm text-slate-500">
                Current order activity
              </p>
            </div>

            <ShoppingCart size={24} className="text-slate-400" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-purple-50 p-4">
              <p className="text-sm text-slate-500">Total Orders</p>

              <p className="mt-2 text-2xl font-bold text-purple-700">
                {totalOrders}
              </p>
            </div>

            <div className="rounded-xl bg-yellow-50 p-4">
              <p className="text-sm text-slate-500">Pending Orders</p>

              <p className="mt-2 text-2xl font-bold text-yellow-700">
                {pendingOrders}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-sm text-slate-500">Paid Orders</p>

              <p className="mt-2 text-2xl font-bold text-green-700">
                {paidOrders}
              </p>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="font-bold text-slate-800">Quick Actions</h2>

          <p className="mt-1 text-sm text-slate-500">
            Quickly access common admin tasks
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => navigate("/admin/products/new")}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <Plus size={19} />
              Add Product
            </button>

            <button
              onClick={() => navigate("/admin/products")}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Package size={19} />
              Manage Products
            </button>

            <button
              onClick={() => navigate("/admin/orders")}
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              <ListOrdered size={19} />
              View Orders
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
