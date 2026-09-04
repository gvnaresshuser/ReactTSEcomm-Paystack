import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Package,
  PackageCheck,
  Phone,
  Truck,
  User,
} from "lucide-react";
//import Swal from "sweetalert2";
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

  // Shows the small "Order status updated" notification
  const [statusChanged, setStatusChanged] = useState(false);

  // Controls the initial visual timeline animation
  const [animationStep, setAnimationStep] = useState(0);

  // Controls the final Delivered celebration
  const [deliveredAnimation, setDeliveredAnimation] = useState(false);

  const previousStatusRef = useRef<string | null>(null);

  // ============================================================
  // FETCH ORDER + POLLING
  // ============================================================

  useEffect(() => {
    if (!id) return;

    let interval: ReturnType<typeof setInterval>;

    const fetchOrder = async () => {
      try {
        const response = await api.get(`/api/orders/${id}`);

        const updatedOrder: TrackingOrder = response.data.order;

        // --------------------------------------------------------
        // Detect actual database status change
        // --------------------------------------------------------

        if (
          previousStatusRef.current !== null &&
          previousStatusRef.current !== updatedOrder.status
        ) {
          setStatusChanged(true);

          setTimeout(() => {
            setStatusChanged(false);
          }, 3000);

          // ------------------------------------------------------
          // DELIVERY COMPLETED
          // ------------------------------------------------------

          if (updatedOrder.status === "Delivered") {
            setDeliveredAnimation(true);

            // Make sure the first three stages are complete
            setAnimationStep(3);

            setTimeout(() => {
              setDeliveredAnimation(false);
            }, 5000);
          }
        }

        previousStatusRef.current = updatedOrder.status;

        setOrder(updatedOrder);

        // --------------------------------------------------------
        // Stop polling once delivery is completed
        // --------------------------------------------------------

        if (updatedOrder.status === "Delivered") {
          clearInterval(interval);
        }
      } catch (error: any) {
        console.error("Track order error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately
    fetchOrder();

    // Poll every 5 seconds
    interval = setInterval(fetchOrder, 5000);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [id]);

  // ============================================================
  // INITIAL TIMELINE ANIMATION
  // ============================================================

  useEffect(() => {
    if (!order) return;

    // If order is already delivered,
    // don't make the customer wait for the animation.
    if (order.status === "Delivered") {
      setAnimationStep(3);
      return;
    }

    // Step 1 immediately
    setAnimationStep(1);

    // Step 2 after 5 seconds
    const preparedTimer = setTimeout(() => {
      setAnimationStep(2);
    }, 5000);

    // Step 3 after 10 seconds
    const deliveryTimer = setTimeout(() => {
      setAnimationStep(3);
    }, 10000);

    return () => {
      clearTimeout(preparedTimer);
      clearTimeout(deliveryTimer);
    };
  }, [order?.status]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  // ============================================================
  // ORDER NOT FOUND
  // ============================================================

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

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8">
        <Link
          to="/orders"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Orders
        </Link>

        <h1 className="text-3xl font-bold text-slate-900">Track Your Order</h1>

        <p className="mt-1 text-sm text-slate-500">
          Order #{order.id.slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* ======================================================
          STATUS UPDATED NOTIFICATION
      ====================================================== */}

      {statusChanged && (
        <div className="mb-5 flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 animate-pulse">
          <Check size={17} />
          Order status updated
        </div>
      )}

      {/* ======================================================
          STATUS CARD
      ====================================================== */}

      <div
        className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-700 ${
          statusChanged
            ? "border-blue-400 shadow-lg shadow-blue-100"
            : "border-slate-200"
        }`}
      >
        {/* Current status */}

        <div className="mb-8 flex items-center gap-4">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-700 ${
              isDelivered
                ? "bg-green-100 text-green-600"
                : "bg-blue-50 text-blue-600"
            } ${statusChanged ? "scale-110" : ""}`}
          >
            {isDelivered ? (
              <Check
                size={28}
                className={statusChanged ? "animate-bounce" : ""}
              />
            ) : (
              <Truck size={28} />
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Current Status</p>

            <h2 className="text-xl font-bold text-slate-900">
              {isDelivered ? "Delivered" : "Your order is on the way"}
            </h2>
          </div>
        </div>

        {/* ==================================================
            TIMELINE
        ================================================== */}

        <div className="relative ml-3">
          {/* Order Confirmed */}

          <AnimatedTimelineItem
            title="Order Confirmed"
            step={1}
            animationStep={animationStep}
            icon={<Package size={17} />}
            message="Your order has been confirmed"
          />

          {/* Order Prepared */}

          <AnimatedTimelineItem
            title="Order Prepared"
            step={2}
            animationStep={animationStep}
            icon={<PackageCheck size={17} />}
            message="Your order is being prepared"
          />

          {/* Out for Delivery */}

          <AnimatedTimelineItem
            title="Out for Delivery"
            step={3}
            animationStep={animationStep}
            icon={<Truck size={17} />}
            message="Your order is on the way"
          />

          {/* On the Way */}

          <TimelineItem
            title="On the Way"
            completed={isDelivered}
            active={!isDelivered}
          />

          {/* Reaching You */}

          <TimelineItem title="Reaching You" completed={isDelivered} />

          {/* Delivered */}

          <TimelineItem
            title="Delivered"
            completed={isDelivered}
            last
            celebration={deliveredAnimation}
          />
        </div>

        {/* Automatic status message */}

        {!isDelivered && (
          <div className="mt-5 border-t border-slate-100 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Order status is updated automatically
            </p>
          </div>
        )}
      </div>

      {/* ======================================================
          DELIVERY PARTNER
      ====================================================== */}

      {order.delivery_partner_name && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-slate-900">
            Your Delivery Partner
          </h2>

          <div className="flex items-center gap-4">
            {/* Partner icon */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <User size={23} />
            </div>

            {/* Partner information */}

            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {order.delivery_partner_name}
              </p>

              {order.delivery_partner_phone && (
                <a
                  href={`tel:${order.delivery_partner_phone}`}
                  className="mt-1 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
                >
                  <Phone size={16} />
                  {order.delivery_partner_phone}
                </a>
              )}
            </div>
          </div>

          {/* Call button */}

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

      {/* ======================================================
          DELIVERED MESSAGE
      ====================================================== */}

      {isDelivered && (
        <div
          className={`mt-6 rounded-2xl border border-green-200 bg-green-50 p-6 text-center transition-all duration-700 ${
            deliveredAnimation ? "scale-[1.02] shadow-lg shadow-green-100" : ""
          }`}
        >
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 transition-transform duration-700 ${
              deliveredAnimation ? "scale-125" : ""
            }`}
          >
            <Check
              size={25}
              className={deliveredAnimation ? "animate-bounce" : ""}
            />
          </div>

          <h2 className="mt-3 text-lg font-bold text-green-800">
            Your order has been delivered!
          </h2>

          <p className="mt-1 text-sm text-green-700">
            Thank you for shopping with us.
          </p>
        </div>
      )}

      {/* ======================================================
          ORDER DETAILS
      ====================================================== */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Package size={20} className="text-slate-500" />

          <div>
            <p className="text-sm text-slate-500">Order Total</p>

            <p className="font-bold text-slate-900">
              ₦{Number(order.total_amount).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
   ANIMATED TIMELINE ITEM
   ============================================================ */

interface AnimatedTimelineItemProps {
  title: string;
  step: number;
  animationStep: number;
  icon: React.ReactNode;
  message: string;
}

const AnimatedTimelineItem = ({
  title,
  step,
  animationStep,
  icon,
  message,
}: AnimatedTimelineItemProps) => {
  const visible = animationStep >= step;

  const active = animationStep === step;

  return (
    <div className="relative flex min-h-[72px] gap-4">
      {/* Connecting line */}

      {step < 3 && (
        <div
          className={`absolute left-[15px] top-8 h-full w-0.5 transition-all duration-1000 ${
            animationStep > step ? "bg-blue-500" : "bg-slate-200"
          }`}
        />
      )}

      {/* Circle */}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-1000 ${
          visible
            ? "bg-blue-600 text-white"
            : "border-2 border-slate-200 bg-white text-slate-300"
        } ${active ? "scale-125 shadow-lg shadow-blue-200" : "scale-100"}`}
      >
        {visible &&
          (active ? (
            <span className="animate-pulse">{icon}</span>
          ) : (
            <Check size={16} />
          ))}
      </div>

      {/* Text */}

      <div
        className={`pt-1 transition-all duration-1000 ${
          visible ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0"
        }`}
      >
        <p
          className={`text-sm font-semibold transition-colors duration-700 ${
            active ? "text-blue-700" : "text-slate-900"
          }`}
        >
          {title}
        </p>

        {active && (
          <p className="mt-1 text-xs text-blue-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   NORMAL TIMELINE ITEM
   ============================================================ */

interface TimelineItemProps {
  title: string;
  completed?: boolean;
  active?: boolean;
  last?: boolean;
  celebration?: boolean;
}

const TimelineItem = ({
  title,
  completed = false,
  active = false,
  last = false,
  celebration = false,
}: TimelineItemProps) => {
  return (
    <div className="relative flex min-h-[72px] gap-4">
      {/* Connecting line */}

      {!last && (
        <div
          className={`absolute left-[15px] top-8 h-full w-0.5 transition-colors duration-700 ${
            completed ? "bg-blue-500" : "bg-slate-200"
          }`}
        />
      )}

      {/* Circle */}

      <div
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-700 ${
          completed
            ? "bg-blue-600 text-white"
            : active
              ? "border-4 border-blue-100 bg-blue-600 text-white animate-pulse"
              : "border-2 border-slate-200 bg-white text-slate-300"
        } ${celebration ? "scale-150 shadow-xl shadow-green-200" : ""}`}
      >
        {completed ? (
          <Check size={16} className={celebration ? "animate-bounce" : ""} />
        ) : active ? (
          <Truck size={14} />
        ) : null}
      </div>

      {/* Text */}

      <div className="pt-1">
        <p
          className={`text-sm font-semibold transition-all duration-700 ${
            completed || active ? "text-slate-900" : "text-slate-400"
          } ${celebration ? "origin-left scale-105 text-green-700" : ""}`}
        >
          {title}
        </p>

        {active && (
          <p className="mt-1 text-xs text-blue-600 animate-pulse">
            Your order is currently here
          </p>
        )}

        {celebration && (
          <p className="mt-1 text-xs font-medium text-green-600 animate-pulse">
            Your order has arrived!
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
