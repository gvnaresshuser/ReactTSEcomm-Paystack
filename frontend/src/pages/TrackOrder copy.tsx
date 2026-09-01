import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Package, Phone, Truck, User } from "lucide-react";
import Swal from "sweetalert2";
import api from "../services/api";

interface TrackingOrder {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  updated_at: string;

  delivery_partner_name: string | null;
  delivery_partner_phone: string | null;
}

const TrackOrder = () => {
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/api/orders/${id}`);

        setOrder(response.data.order);
      } catch (error: any) {
        console.error("Track order error:", error);

        await Swal.fire({
          icon: "error",
          title: "Unable to Load Order",
          text:
            error.response?.data?.message || "Failed to load order details.",
          confirmButtonText: "OK",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Order not found</h2>

        <Link
          to="/orders"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>
      </div>
    );
  }

  const isDelivered = order.status === "Delivered";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/orders"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">Track Your Order</h1>

        <p className="mt-1 text-sm text-slate-500">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Status card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            {isDelivered ? <Check size={28} /> : <Truck size={28} />}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Current Status</p>

            <h2 className="text-xl font-bold text-slate-900">
              {isDelivered ? "Delivered" : "Your order is on the way"}
            </h2>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative ml-3">
          <TimelineItem title="Order Confirmed" completed first />

          <TimelineItem title="Order Prepared" completed />

          <TimelineItem title="Out for Delivery" completed />

          <TimelineItem
            title="On the Way"
            completed={isDelivered}
            active={!isDelivered}
          />

          <TimelineItem title="Reaching You" completed={isDelivered} />

          <TimelineItem title="Delivered" completed={isDelivered} last />
        </div>
      </div>

      {/* Delivery Partner */}
      {order.delivery_partner_name && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Your Delivery Partner
          </h2>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <User size={23} />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {order.delivery_partner_name}
              </p>

              {order.delivery_partner_phone && (
                <a
                  href={`tel:${order.delivery_partner_phone}`}
                  className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <Phone size={16} />
                  {order.delivery_partner_phone}
                </a>
              )}
            </div>
          </div>

          {order.delivery_partner_phone && (
            <a
              href={`tel:${order.delivery_partner_phone}`}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Phone size={18} />
              Call Delivery Partner
            </a>
          )}
        </div>
      )}

      {/* Delivered message */}
      {isDelivered && (
        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Check size={25} />
          </div>

          <h2 className="mt-3 text-lg font-bold text-green-800">
            Your order has been delivered!
          </h2>

          <p className="mt-1 text-sm text-green-700">
            Thank you for shopping with us.
          </p>
        </div>
      )}

      {/* Order details */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Package size={20} className="text-slate-500" />

          <div>
            <p className="text-sm text-slate-500">Order Total</p>

            <p className="font-bold text-slate-900">
              ₹{Number(order.total_amount).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TimelineItemProps {
  title: string;
  completed?: boolean;
  active?: boolean;
  first?: boolean;
  last?: boolean;
}

const TimelineItem = ({
  title,
  completed = false,
  active = false,
  last = false,
}: TimelineItemProps) => {
  return (
    <div className="relative flex min-h-[72px] gap-4">
      {!last && (
        <div
          className={`absolute left-[15px] top-8 h-full w-0.5 ${
            completed ? "bg-blue-500" : "bg-slate-200"
          }`}
        />
      )}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          completed
            ? "bg-blue-600 text-white"
            : active
              ? "border-4 border-blue-100 bg-blue-600 text-white"
              : "border-2 border-slate-200 bg-white text-slate-300"
        }`}
      >
        {completed ? <Check size={16} /> : active ? <Truck size={14} /> : null}
      </div>

      <div className="pt-1">
        <p
          className={`text-sm font-semibold ${
            completed || active ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {title}
        </p>

        {active && (
          <p className="mt-1 text-xs text-blue-600">
            Your order is currently here
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
