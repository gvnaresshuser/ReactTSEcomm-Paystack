import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { UserRoundCheck } from "lucide-react";
const ProtectedRoute = () => {
  const { user, isInitialized } = useAppSelector((state) => state.auth);

  if (!isInitialized) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-2xl backdrop-blur-sm">
            {/* AUTHENTICATION ICON */}
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
              {/* Animated outer glow */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl" />

              {/* Spinning ring */}
              <div className="absolute inset-1 rounded-full border-4 border-slate-200 border-t-blue-600 border-r-purple-600 animate-spin" />

              {/* User icon container */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
                <UserRoundCheck
                  size={42}
                  strokeWidth={1.8}
                  className="text-blue-600"
                />
              </div>
            </div>

            {/* HEADING */}
            <h2 className="mt-7 text-xl font-bold text-slate-800">
              Checking Authentication
            </h2>

            {/* MESSAGE */}
            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're securely verifying your session
            </p>

            {/* STATUS */}
            <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full bg-slate-50 px-4 py-2 shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />

              <span className="text-xs font-semibold text-slate-500">
                Verifying your account
              </span>
            </div>

            {/* ANIMATED DOTS */}
            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" />
            </div>

            {/* FOOTER */}
            <p className="mt-6 text-xs font-medium text-slate-400">
              Please wait a moment...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
