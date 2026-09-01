import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { ArrowLeft, MapPin, RefreshCw, Truck } from "lucide-react";

import "leaflet/dist/leaflet.css";
import api from "../../services/api";

interface TrackingPoint {
  id: string;
  order_id: string;
  latitude: number;
  longitude: number;
  recorded_at: string;
}

interface TrackingResponse {
  success: boolean;

  order: {
    id: string;
    status: string;
  };

  points: TrackingPoint[];
}

/* interface OrderResponse {
  success: boolean;
  order: {
    id: string;
    status: string;
  };
} */

// =====================================================
// FIX LEAFLET DEFAULT MARKER ICON
// =====================================================

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// =====================================================
// ADDRESS CACHE
// =====================================================

const ADDRESS_CACHE_KEY = "tracking_address_cache";

interface AddressCacheItem {
  lat: number;
  lng: number;
  address: string;
}

type AddressCache = Record<string, AddressCacheItem>;

const getAddressCache = (): AddressCache => {
  try {
    return JSON.parse(localStorage.getItem(ADDRESS_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
};

const saveAddressCache = (cache: AddressCache) => {
  localStorage.setItem(ADDRESS_CACHE_KEY, JSON.stringify(cache));
};

// =====================================================
// MAP CENTER COMPONENT
// =====================================================

const MapCenter = ({ position }: { position: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 17);
  }, [map, position]);

  return null;
};

// =====================================================
// TRACKING MARKER
// =====================================================

interface TrackingMarkerProps {
  point: TrackingPoint;
  index: number;
}

const TrackingMarker = ({ point, index }: TrackingMarkerProps) => {
  const lat = Number(point.latitude);
  const lng = Number(point.longitude);
  const [address, setAddress] = useState<string | null>(null);

  const [loadingAddress, setLoadingAddress] = useState(false);

  const [addressError, setAddressError] = useState(false);

  const handleMarkerClick = async () => {
    const trackingId = point.id;

    console.log("Clicked tracking point:", trackingId);

    console.log("Coordinates:", lat, lng);

    // =================================================
    // STEP 1
    // CHECK LOCAL STORAGE
    // =================================================

    const cache = getAddressCache();

    const cached = cache[trackingId];

    if (cached) {
      console.log("✅ Address found in LocalStorage:", cached.address);

      setAddress(cached.address);

      return;
    }

    // =================================================
    // STEP 2
    // ADDRESS NOT CACHED
    // =================================================

    console.log("❌ Address not found in LocalStorage");

    console.log("Calling reverse geocoding API...");

    setLoadingAddress(true);
    setAddressError(false);

    try {
      const response = await api.get("/api/geocode/reverse", {
        params: {
          lat,
          lng,
        },
      });

      if (response.data.success && response.data.address) {
        const newAddress = response.data.address;

        console.log("✅ Address received:", newAddress);

        // =============================================
        // STORE IN STATE
        // =============================================

        setAddress(newAddress);

        // =============================================
        // GET LATEST CACHE
        // =============================================

        const latestCache = getAddressCache();

        // =============================================
        // SAVE ADDRESS AGAINST TRACKING ID
        // =============================================

        latestCache[trackingId] = {
          lat,
          lng,
          address: newAddress,
        };

        saveAddressCache(latestCache);

        console.log(
          "✅ Address saved to LocalStorage:",
          trackingId,
          newAddress,
        );
      } else {
        setAddressError(true);
      }
    } catch (error) {
      console.error("Reverse geocoding error:", error);

      setAddressError(true);
    } finally {
      setLoadingAddress(false);
    }
  };

  return (
    <Marker
      position={[Number(point.latitude), Number(point.longitude)]}
      icon={markerIcon}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup>
        <div className="min-w-[220px] text-sm">
          <strong>GPS Point #{index + 1}</strong>

          <br />

          <span className="text-slate-500">
            {new Date(point.recorded_at).toLocaleString()}
          </span>

          <div className="my-2 border-t" />

          <strong>Location</strong>

          <br />

          {loadingAddress && (
            <span className="text-slate-500">Getting address...</span>
          )}

          {!loadingAddress && address && <span>{address}</span>}

          {!loadingAddress && addressError && (
            <span className="text-red-600">Unable to get address.</span>
          )}

          {!loadingAddress && !address && !addressError && (
            <span className="text-slate-500">Click marker to get address.</span>
          )}

          <div className="mt-2 text-xs text-slate-500">
            <div>Latitude: {lat.toFixed(6)}</div>

            <div>Longitude: {lng.toFixed(6)}</div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// =====================================================
// COMPONENT
// =====================================================
const VALID_REFRESH_INTERVALS = [5000, 10000, 15000, 30000, 60000];
const PartnerLiveTracking = () => {
  const { id } = useParams();

  const [points, setPoints] = useState<TrackingPoint[]>([]);
  const [orderStatus, setOrderStatus] = useState<string>("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(() => {
    const saved = Number(
      localStorage.getItem("partner_tracking_refresh_interval"),
    );

    return VALID_REFRESH_INTERVALS.includes(saved) ? saved : 5000;
  });

  // ===================================================
  // FETCH TRACKING DATA
  // ===================================================

  /*  const fetchTracking = async () => {
    if (!id) return;

    try {
      setError(null);

      const [trackingResponse, orderResponse] = await Promise.all([
        api.get<TrackingResponse>(`/api/partner/tracking/${id}`),

        api.get<OrderResponse>(`/api/partner/deliveries/${id}`),
      ]);

      if (trackingResponse.data.success) {
        setPoints(trackingResponse.data.points);
      }

      if (orderResponse.data.success) {
        setOrderStatus(orderResponse.data.order.status);
      }
    } catch (err) {
      console.error("Tracking fetch error:", err);

      setError("Unable to load live tracking.");
    } finally {
      setLoading(false);
    }
  }; */

  const fetchTracking = async () => {
    if (!id) return;

    try {
      setError(null);

      const response = await api.get<TrackingResponse>(
        `/api/partner/tracking/${id}`,
      );
console.log('RESPONSE::',response);
      if (response.data.success) {
        setPoints(response.data.points);

        setOrderStatus(response.data.order.status);
      }
    } catch (err) {
      console.error("Tracking fetch error:", err);

      setError("Unable to load live tracking.");
    } finally {
      setLoading(false);
    }
  };
  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchTracking();
  }, [id]);

  // ===================================================
  // LIVE REFRESH
  // ===================================================

  useEffect(() => {
    if (!id || orderStatus !== "OutForDelivery") {
      return;
    }

    /*   const interval = setInterval(() => {
      fetchTracking();
    }, 5000); */
    const interval = setInterval(() => {
      fetchTracking();
    }, refreshInterval);

    return () => {
      clearInterval(interval);
    };
  }, [id, orderStatus, refreshInterval]);

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw size={20} className="animate-spin" />
          Loading live tracking...
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">{error}</p>

        <button
          onClick={fetchTracking}
          className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ===================================================
  // NO TRACKING POINTS
  // ===================================================

  if (points.length === 0) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Deliveries
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <MapPin size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-800">
            No Tracking Data
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            GPS tracking points will appear here when the delivery starts.
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // MAP DATA
  // ===================================================

  const coordinates: [number, number][] = points.map((point) => [
    Number(point.latitude),
    Number(point.longitude),
  ]);

  const latestPoint = coordinates[coordinates.length - 1];

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="space-y-5">
      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => window.history.back()}
            className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={17} />
            Back to Deliveries
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Truck size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Live Tracking
              </h1>

              <p className="text-sm text-slate-500">Order #{id?.slice(0, 8)}</p>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              orderStatus === "Delivered"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {orderStatus || "Tracking"}
          </span>

          {orderStatus !== "Delivered" && orderStatus !== "Cancelled" && (
            <button
              onClick={fetchTracking}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          )}
        </div> */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              orderStatus === "Delivered"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {orderStatus || "Tracking"}
          </span>

          {orderStatus !== "Delivered" && orderStatus !== "Cancelled" && (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <span className="text-xs font-medium text-slate-500">
                  Refresh every
                </span>

                <select
                  value={refreshInterval}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    if (!VALID_REFRESH_INTERVALS.includes(value)) {
                      return;
                    }

                    setRefreshInterval(value);

                    localStorage.setItem(
                      "partner_tracking_refresh_interval",
                      String(value),
                    );
                  }}
                  className="bg-transparent text-sm font-semibold text-slate-700 outline-none"
                >
                  <option value={5000}>5 seconds</option>

                  <option value={10000}>10 seconds</option>

                  <option value={15000}>15 seconds</option>

                  <option value={30000}>30 seconds</option>

                  <option value={60000}>60 seconds</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                5 seconds is recommended for live tracking.
              </p>

              <button
                onClick={fetchTracking}
                className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </>
          )}
        </div>
      </div>

      {/* MAP */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="h-[500px] w-full">
          <MapContainer
            center={latestPoint}
            zoom={17}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <MapCenter position={latestPoint} />

            {/* ROUTE */}

            <Polyline
              positions={coordinates}
              pathOptions={{
                color: "blue",
                weight: 5,
              }}
            />

            {/* ALL GPS POINTS */}

            {/*  {points.map((point, index) => (
              <Marker
                key={point.id}
                position={[Number(point.latitude), Number(point.longitude)]}
                icon={markerIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>GPS Point #{index + 1}</strong>
                    <br />
                    Latitude: {point.latitude}
                    <br />
                    Longitude: {point.longitude}
                    <br />
                    {new Date(point.recorded_at).toLocaleString()}
                  </div>
                </Popup>
              </Marker>
            ))} */}
            {points.map((point, index) => (
              <TrackingMarker key={point.id} point={point} index={index} />
            ))}
          </MapContainer>
        </div>
      </div>

      {/* TRACKING INFORMATION */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Tracking Points</p>

          <p className="mt-2 text-2xl font-bold text-slate-800">
            {points.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Current Latitude</p>

          <p className="mt-2 text-lg font-bold text-slate-800">
            {latestPoint[0]}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500">
            Current Longitude
          </p>

          <p className="mt-2 text-lg font-bold text-slate-800">
            {latestPoint[1]}
          </p>
        </div>
      </div>

      {/* LAST UPDATE */}

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <MapPin size={19} className="text-blue-600" />

          <div>
            <p className="text-sm font-semibold text-blue-800">
              Last GPS Update
            </p>

            <p className="text-xs text-blue-600">
              {new Date(points[points.length - 1].recorded_at).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerLiveTracking;
