import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, LogIn, Phone, Truck } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../services/api";

interface PartnerLoginResponse {
  success: boolean;
  message: string;
  token: string;
  partner: {
    id: string;
    full_name: string;
    phone: string;
    email?: string;
    city?: string;
    vehicle_type?: string;
    vehicle_number?: string;
    status: string;
  };
}

const PartnerLogin = () => {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!phone.trim() || !password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please enter your phone number and password.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold",
          htmlContainer: "text-sm text-slate-500",
          confirmButton:
            "rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white",
        },
      });

      return;
    }

    try {
      setLoading(true);

      const response = await api.post<PartnerLoginResponse>(
        "/api/partner/auth/login",
        {
          phone: phone.trim(),
          password,
        },
      );

      const { token, partner } = response.data;

      localStorage.setItem("partnerToken", token);

      localStorage.setItem("partner", JSON.stringify(partner));

      await Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: `Welcome ${partner.full_name}.`,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1800,
        timerProgressBar: true,

        background: "linear-gradient(135deg, #16a34a, #22c55e, #4ade80)",

        color: "#ffffff",

        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-lg font-bold text-white",
          htmlContainer: "text-sm text-green-50",
        },
      });

      navigate("/partner/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      console.error("Partner login error:", error);

      await Swal.fire({
        icon: "error",
        title: "Login Failed",
        text:
          error.response?.data?.message || "Invalid phone number or password.",
        confirmButtonText: "Try Again",
        buttonsStyling: false,

        background: "linear-gradient(135deg, #991b1b, #dc2626, #ef4444)",

        color: "#ffffff",

        customClass: {
          popup: "rounded-2xl shadow-2xl",
          title: "text-xl font-bold text-white",
          htmlContainer: "text-sm text-red-50",
          confirmButton:
            "rounded-xl bg-white px-6 py-3 text-sm font-semibold text-red-600 shadow-md hover:bg-red-50",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
    bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
    relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 px-4 py-8"
    >
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-purple-300/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* LOGO */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl">
            <Truck size={38} strokeWidth={2.2} />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Partner Login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your deliveries
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          {/* CARD HEADER */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Welcome back 👋
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your partner credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* PHONE */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  autoComplete="tel"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  disabled={loading}
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={19} />
                  Partner Login
                </>
              )}
            </button>
          </form>

          {/* CUSTOMER LOGIN */}
          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-500">Not a delivery partner?</p>

            <button
              type="button"
              onClick={() => navigate("/login")}
              className="mt-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Customer / Admin Login →
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Secure Delivery Partner Portal
        </p>
      </div>
    </div>
  );
};

export default PartnerLogin;
