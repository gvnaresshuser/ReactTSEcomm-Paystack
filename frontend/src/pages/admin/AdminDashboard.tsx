import { useEffect, useState } from "react";
import api from "../../services/api";

interface Dashboard {
  total_products: string;
  total_orders: string;
  pending_orders: string;
  paid_orders: string;
  total_sales: string;
}

const AdminDashboard = () => {
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
    return <div className="p-4">Loading dashboard...</div>;
  }

  if (!dashboard) {
    return <div className="p-4">Failed to load dashboard.</div>;
  }

  const cards = [
    {
      title: "Total Products",
      value: dashboard.total_products,
      style: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total Orders",
      value: dashboard.total_orders,
      style: "bg-purple-100 text-purple-700",
    },
    {
      title: "Pending Orders",
      value: dashboard.pending_orders,
      style: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Paid Orders",
      value: dashboard.paid_orders,
      style: "bg-green-100 text-green-700",
    },
    {
      title: "Total Sales",
      value: `₦${Number(dashboard.total_sales).toLocaleString("en-IN")}`,
      style: "bg-orange-100 text-orange-700",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-5 text-2xl font-bold text-slate-800 sm:text-3xl">
          Admin Dashboard
        </h1>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="rounded-xl bg-white p-5 shadow-md">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>

              <p
                className={`mt-3 inline-block rounded-lg px-4 py-2 text-xl font-bold sm:text-2xl ${card.style}`}
              >
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
