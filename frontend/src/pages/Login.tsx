import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LoaderCircle, Mail, LockKeyhole } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearAuthMessages, loginUser } from "../redux/slices/authSlice";
import './Login.css';

// ============================================
// LOGIN VALIDATION SCHEMA
// ============================================

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ============================================
// FORM TYPE
// ============================================

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// LOGIN COMPONENT
// ============================================

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ------------------------------------------
  // AUTH STATE
  // ------------------------------------------

  const { user, loginLoading, error, successMessage } = useAppSelector(
    (state) => state.auth,
  );

  // ------------------------------------------
  // REACT HOOK FORM
  // ------------------------------------------

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ------------------------------------------
  // CLEAR OLD AUTH MESSAGES
  // ------------------------------------------

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  // ------------------------------------------
  // LOGIN SUCCESS
  // ------------------------------------------

  useEffect(() => {
    if (!successMessage) return;

    reset();
    console.log("USER", user);

    const timer = setTimeout(() => {
      if (user?.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/products");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [successMessage, user, navigate, reset]);

  // ------------------------------------------
  // DEMO LOGIN
  // ------------------------------------------

  const handleDemoLogin = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
  };

  // ------------------------------------------
  // SUBMIT LOGIN FORM
  // ------------------------------------------

  const onSubmit = async (data: LoginFormData) => {
    await dispatch(loginUser(data));
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 px-4 py-8">
      <div className="w-full max-w-md">
        {/* ====================================
            HEADER
        ==================================== */}

        <div className="mb-6 text-center text-white">
          {/* Logo */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-xl">
            <ShoppingBag
              size={30}
              strokeWidth={2}
              className="text-purple-600"
            />
          </div>

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Welcome Back!</h1>

          {/* Subtitle */}
          <p className="mt-2 text-sm text-blue-50 sm:text-base">
            Login to continue your shopping journey
          </p>
        </div>

        {/* ====================================
            LOGIN CARD
        ==================================== */}

        <div className="rounded-3xl bg-white/95 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
          {/* Card Heading */}

          <div className="mb-7 text-center">
            <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your details below
            </p>
          </div>

          {/* ==================================
              ERROR MESSAGE
          ================================== */}

          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <span className="mt-0.5 text-lg">⚠️</span>

              <p>{error}</p>
            </div>
          )}

          {/* ==================================
              SUCCESS MESSAGE
          ================================== */}

          {successMessage && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                ✓
              </span>

              <span>{successMessage}</span>
            </div>
          )}

          {/* ==================================
              LOGIN FORM
          ================================== */}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* --------------------------------
                EMAIL
            -------------------------------- */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition ${
                    errors.email
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-300 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* --------------------------------
                PASSWORD
            -------------------------------- */}

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
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition ${
                    errors.password
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-300 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  }`}
                />
              </div>

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ==================================
                LOGIN BUTTON
            ================================== */}

            <button
              type="submit"
              disabled={loginLoading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3.5 font-semibold text-white shadow-lg transition duration-200 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {loginLoading ? (
                <>
                  <LoaderCircle
                    size={20}
                    strokeWidth={2.5}
                    className="animate-spin"
                  />

                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>

                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </>
              )}
            </button>

            {/* ==================================
                DEMO ACCOUNTS
            ================================== */}
            <div className="demo-accounts">
              <div className="demo-title">🧪 Demo Accounts</div>

              <div className="demo-subtitle">
                Click an account to auto-fill credentials
              </div>

              {/* ADMIN */}
              <div
                className="demo-account"
                onClick={() => handleDemoLogin("admin@gmail.com", "123456")}
              >
                <span className="demo-role admin-role">👑 ADMIN</span>

                <span>
                  <strong>admin@gmail.com</strong>
                  {" / "}
                  <strong>123456</strong>
                </span>
              </div>

              {/* USER */}
              <div
                className="demo-account"
                onClick={() => handleDemoLogin("user@gmail.com", "123456")}
              >
                <span className="demo-role user-role">👤 USER</span>

                <span>
                  <strong>user@gmail.com</strong>
                  {" / "}
                  <strong>123456</strong>
                </span>
              </div>
            </div>

            <div className="mt-0 border-t border-slate-200 pt-5 text-center">
              <p className="text-sm text-slate-500">
                Are you a delivery partner?
              </p>

              <button
                type="button"
                onClick={() => navigate("/partner/login")}
                className="mt-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Partner Login →
              </button>
            </div>
          </form>
          <hr className="mt-2 border-t-gray-400" />

          {/* ==================================
              REGISTER SECTION
          ================================== */}

          <div className="mt-1 border-t border-slate-100 pt-2 text-center">
            <p className="text-sm text-slate-600">Don't have an account?</p>

            <Link
              to="/register"
              className="mt-1 inline-block font-bold text-purple-600 transition hover:text-pink-600"
            >
              Create an account →
            </Link>
          </div>
        </div>

        {/* ====================================
            FOOTER
        ==================================== */}

        <div className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-white/80">
          <span>🔒</span>

          <span>Secure & simple shopping experience</span>
        </div>
      </div>
    </main>
  );
};;

export default Login;
