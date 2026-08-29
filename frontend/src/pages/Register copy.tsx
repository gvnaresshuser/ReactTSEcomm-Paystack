import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
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

  const { loading, error, successMessage } = useAppSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
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
    await dispatch(registerUser(data));
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-lg backdrop-blur-sm">
            ✨
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">Create Account</h1>

          <p className="mt-2 text-sm text-indigo-100 sm:text-base">
            Join our E-Commerce platform
          </p>
        </div>

        {/* Card */}
        <div className="rounded-3xl bg-white p-5 shadow-2xl sm:p-7 md:p-8">
          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* Success */}
          {successMessage && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              ✓ {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
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
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.name
                    ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300 bg-slate-50 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                }`}
                placeholder="Enter your name"
              />

              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
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
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.email
                    ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300 bg-slate-50 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                }`}
                placeholder="Enter your email"
              />

              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
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
                className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition ${
                  errors.password
                    ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300 bg-slate-50 focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-200"
                }`}
                placeholder="Enter your password"
              />

              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
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

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-indigo-100">
          Create your account and start shopping today
        </p>
      </div>
    </main>
  );
};

export default Register;
