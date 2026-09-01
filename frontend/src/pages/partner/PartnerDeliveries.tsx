//import { useEffect, useRef, useState } from "react";
import { useEffect, useState } from "react";
import {
  Truck,
  Package,
  MapPin,
  Mail,
  IndianRupee,
  CalendarDays,
  Navigation,
  RefreshCw,
  CheckCircle,
  CreditCard,
  
} from "lucide-react";
import Swal from "sweetalert2";
import api from "../../services/api";
//import { useNavigate } from "react-router-dom";

interface Delivery {
  id: string;
  user_id: string;

  customer_name: string;
  customer_email: string;

  total_amount: string | number;

  status: string;
  payment_status: string;
  payment_method: "Online" | "COD";
  paystack_reference: string | null;

  delivery_partner_id: string;

  created_at: string;
  updated_at: string;
}

const PartnerDeliveries = () => {
  //const navigate = useNavigate();
  //const watchIdRef = useRef<number | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/partner/deliveries");

      setDeliveries(response.data.deliveries || []);
    } catch (error: any) {
      console.error("Fetch partner deliveries error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Load Deliveries",
        text:
          error.response?.data?.message || "Failed to load your deliveries.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold",
          confirmButton:
            "rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);
/*   useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []); */

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "OutForDelivery":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Packed":
        return "bg-purple-100 text-purple-700";

      case "Confirmed":
        return "bg-indigo-100 text-indigo-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const formatStatus = (status: string) => {
    if (status === "OutForDelivery") {
      return "Out for Delivery";
    }

    return status;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

/*   const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);

      watchIdRef.current = null;

      console.log("GPS tracking stopped.");
    }
  }; */
 /*  const startLocationTracking = (orderId: string) => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "error",
        title: "GPS Not Supported",
        text: "Your device does not support location tracking.",
      });

      return;
    }

    // Prevent multiple GPS watchers
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log("GPS POSITION RECEIVED");

        console.log("Latitude:", position.coords.latitude);
        console.log("Longitude:", position.coords.longitude);
        console.log("Accuracy:", position.coords.accuracy);
        console.log(
          "Timestamp:",
          new Date(position.timestamp).toLocaleTimeString(),
        );

        try {
          await api.post("/api/partner/tracking", {
            order_id: orderId,
            latitude,
            longitude,
          });

          console.log("Location sent:", latitude, longitude);
        } catch (error) {
          console.error("Tracking update error:", error);
        }
      },
      (error) => {
        console.error("GPS error:", error);
      },
      {
        enableHighAccuracy: true,
        //maximumAge: 10000,
        maximumAge: 0,
        timeout: 15000,
      },
    );
  }; */

  const handleCompleteDelivery = async (orderId: string) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Complete Delivery?",
      text: "Are you sure you have reached the customer and completed this delivery?",
      showCancelButton: true,
      confirmButtonText: "Yes, Complete",
      cancelButtonText: "Cancel",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl shadow-2xl",
        title: "text-xl font-bold text-slate-800",
        htmlContainer: "text-sm text-slate-500",
        confirmButton:
          "mx-1 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700",
        cancelButton:
          "mx-1 rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await api.put(`/api/partner/deliveries/${orderId}/complete`);

      //stopLocationTracking();

      await Swal.fire({
        icon: "success",
        title: "Delivery Completed!",
        text: "The order has been successfully delivered.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold text-green-600",
          htmlContainer: "text-sm text-slate-500",
          confirmButton:
            "rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white",
        },
      });

      fetchDeliveries();
    } catch (error: any) {
      console.error("Complete delivery error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Complete",
        text: error.response?.data?.message || "Failed to complete delivery.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold text-red-600",
          confirmButton:
            "rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white",
        },
      });
    }
  };

 /*  const handleStartDelivery = async (orderId: string) => {
    try {
      await api.put(`/api/partner/deliveries/${orderId}/start`);

      await Swal.fire({
        icon: "success",
        title: "Delivery Started!",
        text: "Your delivery has started. Live location tracking is now active.",
        confirmButtonText: "Start Tracking",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold text-slate-800",
          htmlContainer: "text-sm text-slate-500",
          confirmButton:
            "rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white",
        },
      });

      //startLocationTracking(orderId);

      fetchDeliveries();
    } catch (error: any) {
      console.error("Start delivery error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Start",
        text: error.response?.data?.message || "Failed to start delivery.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold text-red-600",
          confirmButton:
            "rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white",
        },
      });
    }
  }; */

  const handleStartDelivery = async (orderId: string) => {
    try {
      await api.put(`/api/partner/deliveries/${orderId}/start`);

      await Swal.fire({
        icon: "success",
        title: "Delivery Started!",
        text: "Your delivery is now in progress.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold text-slate-800",
          htmlContainer: "text-sm text-slate-500",
          confirmButton:
            "rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white",
        },
      });

      fetchDeliveries();
    } catch (error: any) {
      console.error("Start delivery error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Start",
        text: error.response?.data?.message || "Failed to start delivery.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold text-red-600",
          confirmButton:
            "rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white",
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div
        className="
          rounded-3xl
          bg-gradient-to-br
          from-blue-600
          via-indigo-600
          to-purple-600
          p-6
          text-white
          shadow-xl
          sm:p-8
        "
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="
                flex h-14 w-14 shrink-0
                items-center justify-center
                rounded-2xl
                bg-white/20
                backdrop-blur-sm
              "
            >
              <Truck size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">My Deliveries</h1>

              <p className="mt-1 text-sm text-blue-100">
                Orders assigned to you
              </p>
            </div>
          </div>

          <button
            onClick={fetchDeliveries}
            disabled={loading}
            className="
              flex items-center justify-center
              gap-2 rounded-xl
              bg-white/15
              px-4 py-3
              text-sm font-semibold
              backdrop-blur-sm
              transition
              hover:bg-white/25
              disabled:opacity-50
            "
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs text-blue-100">Total Deliveries</p>

            <p className="mt-1 text-2xl font-bold">{deliveries.length}</p>
          </div>

          <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
            <p className="text-xs text-blue-100">Active</p>

            <p className="mt-1 text-2xl font-bold">
              {
                deliveries.filter(
                  (delivery) =>
                    delivery.status === "Confirmed" ||
                    delivery.status === "Packed" ||
                    delivery.status === "OutForDelivery",
                ).length
              }
            </p>
          </div>

          <div className="hidden rounded-2xl bg-white/10 p-4 backdrop-blur-sm sm:block">
            <p className="text-xs text-blue-100">Delivered</p>

            <p className="mt-1 text-2xl font-bold">
              {
                deliveries.filter((delivery) => delivery.status === "Delivered")
                  .length
              }
            </p>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="grid gap-5 lg:grid-cols-2">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="
                h-72
                animate-pulse
                rounded-3xl
                bg-white
                shadow-sm
              "
            />
          ))}
        </div>
      )}

      {/* EMPTY */}
      {!loading && deliveries.length === 0 && (
        <div
          className="
              rounded-3xl
              border border-slate-200
              bg-white
              px-6 py-14
              text-center
              shadow-sm
            "
        >
          <div
            className="
                mx-auto flex h-20 w-20
                items-center justify-center
                rounded-full
                bg-blue-50
                text-blue-600
              "
          >
            <Package size={38} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            No Deliveries Yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            You don't have any orders assigned to you at the moment.
          </p>
        </div>
      )}

      {/* DELIVERY CARDS */}
      {!loading && deliveries.length > 0 && (
        <div className="grid gap-5 xl:grid-cols-2">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="
                    overflow-hidden
                    rounded-3xl
                    border border-slate-200
                    bg-white
                    shadow-sm
                    transition
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
            >
              {/* CARD HEADER */}
              <div className="border-b border-slate-100 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="
                            flex h-12 w-12 shrink-0
                            items-center justify-center
                            rounded-2xl
                            bg-blue-50
                            text-blue-600
                          "
                    >
                      <Package size={23} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Order
                      </p>

                      <h2 className="truncate text-lg font-bold text-slate-800">
                        #{delivery.id.slice(0, 8)}
                      </h2>
                    </div>
                  </div>

                  <span
                    className={`
                          shrink-0
                          rounded-full
                          px-3 py-1.5
                          text-xs
                          font-bold
                          ${getStatusStyle(delivery.status)}
                        `}
                  >
                    {formatStatus(delivery.status)}
                  </span>
                </div>
              </div>

              {/* CUSTOMER */}
              <div className="space-y-4 p-5 sm:p-6">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Customer
                  </p>

                  <p className="text-base font-bold text-slate-800">
                    {delivery.customer_name}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <Mail size={17} className="shrink-0 text-slate-400" />

                    <span className="truncate text-sm text-slate-600">
                      {delivery.customer_email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                    <CalendarDays
                      size={17}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="text-sm text-slate-600">
                      {formatDate(delivery.created_at)}
                    </span>
                  </div>
                </div>

                {/* ORDER INFO */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* ORDER AMOUNT */}
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <IndianRupee size={17} className="text-green-600" />

                      <span className="text-xs font-medium text-slate-500">
                        Order Amount
                      </span>
                    </div>

                    <p className="mt-1 text-lg font-bold text-slate-800">
                      ₹{Number(delivery.total_amount).toLocaleString("en-IN")}
                    </p>
                  </div>

                  {/* PAYMENT METHOD */}
                  <div
                    className={`rounded-2xl p-4 ${
                      delivery.payment_method === "COD"
                        ? "border border-orange-200 bg-orange-50"
                        : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin
                        size={17}
                        className={
                          delivery.payment_method === "COD"
                            ? "text-orange-600"
                            : "text-blue-600"
                        }
                      />

                      <span className="text-xs font-medium text-slate-500">
                        Payment Method
                      </span>
                    </div>

                    <p
                      className={`mt-1 text-sm font-bold ${
                        delivery.payment_method === "COD"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    >
                      {delivery.payment_method === "COD"
                        ? "Cash on Delivery"
                        : "Online Payment"}
                    </p>
                  </div>

                  {/* PAYMENT STATUS */}
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center gap-2">
                      <CreditCard
                        size={17}
                        className={
                          delivery.payment_status === "Paid"
                            ? "text-green-600"
                            : "text-orange-500"
                        }
                      />

                      <span className="text-xs font-medium text-slate-500">
                        Payment Status
                      </span>
                    </div>

                    <p
                      className={`mt-1 text-sm font-bold ${
                        delivery.payment_status === "Paid"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {delivery.payment_status}
                    </p>
                  </div>
                </div>
                {/* START DELIVERY */}

                {/* DELIVERY ACTION */}
                {delivery.status === "Delivered" ? (
                  <div
                    className="
      flex items-center
      justify-center
      gap-2
      rounded-2xl
      bg-green-50
      px-5 py-3.5
      text-sm
      font-bold
      text-green-700
    "
                  >
                    <Truck size={18} />
                    Delivery Completed
                  </div>
                ) : delivery.status === "Cancelled" ? (
                  <div
                    className="
      flex items-center
      justify-center
      gap-2
      rounded-2xl
      bg-red-50
      px-5 py-3.5
      text-sm
      font-bold
      text-red-700
    "
                  >
                    Delivery Cancelled
                  </div>
                ) : delivery.status === "OutForDelivery" ? (
                  <button
                    onClick={() => handleCompleteDelivery(delivery.id)}
                    className="
      flex w-full
      items-center
      justify-center
      gap-2
      rounded-2xl
      bg-gradient-to-r
      from-green-500
      to-emerald-600
      px-5 py-3.5
      text-sm
      font-bold
      text-white
      shadow-md
      transition
      hover:shadow-lg
      active:scale-[0.99]
    "
                  >
                    <CheckCircle size={18} />
                    Complete Delivery
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartDelivery(delivery.id)}
                    className="
      flex w-full
      items-center
      justify-center
      gap-2
      rounded-2xl
      bg-gradient-to-r
      from-blue-600
      via-indigo-600
      to-purple-600
      px-5 py-3.5
      text-sm
      font-bold
      text-white
      shadow-md
      transition
      hover:shadow-lg
      active:scale-[0.99]
    "
                  >
                    <Navigation size={18} />
                    Start Delivery
                  </button>
                )}

               {/*  {delivery.status === "OutForDelivery" && (
                  <button
                    onClick={() => navigate(`/partner/tracking/${delivery.id}`)}
                    className="
      flex w-full
      items-center
      justify-center
      gap-2
      rounded-2xl
      bg-blue-50
      px-5 py-3.5
      text-sm
      font-bold
      text-blue-700
      transition
      hover:bg-blue-100
    "
                  >
                    <MapPin size={18} />
                    Live Tracking
                  </button>
                )} */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartnerDeliveries;
