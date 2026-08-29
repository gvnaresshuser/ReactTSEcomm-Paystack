import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, CheckCircle, ArrowRight, X } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { registerUser, clearAuthMessages } from "../redux/slices/authSlice";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  //const { loading, error, successMessage } = useAppSelector(
  const { loading, error } = useAppSelector(
    (state) => state.auth,
  );

  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Store registered details for modal
  const [registeredUser, setRegisteredUser] = useState<RegisterFormData | null>(
    null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    const result = await dispatch(registerUser(data));

    // Registration successful
    if (registerUser.fulfilled.match(result)) {
      setRegisteredUser(data);
      setShowModal(true);
      reset();
    }
  };

  // Continue to login
  const handleContinueToLogin = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <>
      {/* ================================
          REGISTER PAGE
      ================================= */}

      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* HEADER */}
          <div className="mb-8 text-center text-white">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-lg backdrop-blur-sm">
              ✨
            </div>

            <h1 className="text-3xl font-bold sm:text-4xl">Create Account</h1>

            <p className="mt-2 text-sm text-indigo-100 sm:text-base">
              Join our E-Commerce platform
            </p>
          </div>

          {/* REGISTER CARD */}
          <div className="rounded-3xl bg-white p-5 shadow-2xl sm:p-7 md:p-8">
            {/* ERROR */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                ⚠️ {error}
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  {...register("name")}
                  placeholder="Enter your name"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    errors.name
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-300 bg-slate-50 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    errors.email
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-300 bg-slate-50 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  {...register("password")}
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                    errors.password
                      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                      : "border-slate-300 bg-slate-50 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                  }`}
                />

                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* LOGIN LINK */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-purple-600 transition hover:text-purple-700"
              >
                Login
              </Link>
            </p>
          </div>

          {/* FOOTER */}
          <p className="mt-6 text-center text-xs text-indigo-100">
            Create your account and start shopping today
          </p>
        </div>
      </main>

      {/* ==========================================
          REGISTRATION SUCCESS MODAL
      =========================================== */}

      {showModal && registeredUser && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          {/* MODAL CARD */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* MODAL HEADER */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 py-7 text-center text-white">
              {/* SUCCESS ICON */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-lg backdrop-blur-sm">
                <CheckCircle size={38} strokeWidth={2} />
              </div>

              <h2 className="mt-4 text-2xl font-bold">
                Registration Successful!
              </h2>

              <p className="mt-1 text-sm text-blue-100">
                Your account has been created successfully.
              </p>
            </div>

            {/* CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute right-5 top-5 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/30"
            >
              <X size={18} />
            </button>

            {/* MODAL CONTENT */}
            <div className="p-6 sm:p-7">
              <p className="mb-5 text-center text-sm text-slate-500">
                Here are the details you registered with:
              </p>

              {/* NAME */}
              <div className="mb-3 flex items-center gap-4 rounded-xl bg-purple-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                  <User size={20} className="text-purple-600" />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Full Name
                  </p>

                  <p className="font-semibold text-slate-800">
                    {registeredUser.name}
                  </p>
                </div>
              </div>

              {/* EMAIL */}
              <div className="mb-3 flex items-center gap-4 rounded-xl bg-blue-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                  <Mail size={20} className="text-blue-600" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500">
                    Email Address
                  </p>

                  <p className="truncate font-semibold text-slate-800">
                    {registeredUser.email}
                  </p>
                </div>
              </div>

              {/* PASSWORD */}
              <div className="mb-5 flex items-center gap-4 rounded-xl bg-pink-50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100">
                  <Lock size={20} className="text-pink-600" />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-500">Password</p>

                  <p className="font-semibold tracking-widest text-slate-800">
                    {"•".repeat(registeredUser.password.length)}
                  </p>
                </div>
              </div>

              {/* INFO */}
              <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm leading-5 text-green-700">
                  ✓ Your registration has been completed. You can now login
                  using your email and password.
                </p>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="button"
                onClick={handleContinueToLogin}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 font-bold text-white shadow-lg transition hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl"
              >
                Continue to Login
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
