import {
  ShoppingBag,
  ArrowRight,
  User,
  ShieldCheck,
  ShoppingCart,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* =========================================
            HERO SECTION
        ========================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-blue-800 to-cyan-500 px-6 py-14 text-center text-white shadow-2xl sm:px-10 sm:py-20">
          {/* Decorative Background Circles */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 shadow-lg ring-1 ring-white/20 backdrop-blur-sm">
              <ShoppingBag size={38} strokeWidth={1.8} />
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              DEBLESSCO
            </h1>
            <p className="text-[40px] font-medium tracking-wider text-slate-500">
              Your Gateway to Global Trade
            </p>

            {/* <h1 className="mt-1 bg-gradient-to-r from-cyan-200 via-white to-purple-200 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-5xl">
              E-Commerce App
            </h1> */}

            {/* Description */}
            <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-blue-100 sm:text-lg">
              Discover great products, add them to your cart, and enjoy a simple
              and secure shopping experience.
            </p>

            {/* Buttons */}
            {user ? (
              <button
                type="button"
                onClick={() => navigate("/products")}
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-xl transition hover:scale-105 hover:bg-blue-50 hover:shadow-2xl"
              >
                Shop Products
                <ArrowRight size={19} />
              </button>
            ) : (
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:scale-105 hover:bg-blue-50"
                >
                  Login
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/20"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =========================================
            USER INFORMATION
        ========================================== */}
        {user && (
          <section className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-[1px] shadow-xl">
            <div className="rounded-[23px] bg-white/95 p-6 backdrop-blur-sm sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* User Icon */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-white shadow-lg">
                  <User size={30} strokeWidth={1.8} />
                </div>

                {/* User Details */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      ✓ Logged In Successfully
                    </span>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                      {user.role}
                    </span>
                  </div>

                  <h2 className="mt-2 text-xl font-bold text-slate-800 sm:text-2xl">
                    Welcome, {user.name}! 👋
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                </div>

                {/* Shop Button */}
                <button
                  type="button"
                  onClick={() => navigate("/products")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
                >
                  Explore
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =========================================
            FEATURE CARDS
        ========================================== */}
        <section className="mt-6 grid gap-5 sm:grid-cols-3">
          {/* QUALITY PRODUCTS */}
          <div className="group overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-[1px] shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="h-full rounded-[23px] bg-white/95 p-6 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg transition group-hover:scale-110">
                <Package size={30} strokeWidth={1.8} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Quality Products
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Browse our latest products and discover something you'll love.
              </p>
            </div>
          </div>

          {/* EASY SHOPPING */}
          <div className="group overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 p-[1px] shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="h-full rounded-[23px] bg-white/95 p-6 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg transition group-hover:scale-110">
                <ShoppingCart size={30} strokeWidth={1.8} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Easy Shopping
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add your favorite products to the cart quickly and easily.
              </p>
            </div>
          </div>

          {/* SECURE CHECKOUT */}
          <div className="group overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-[1px] shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <div className="h-full rounded-[23px] bg-white/95 p-6 text-center backdrop-blur-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg transition group-hover:scale-110">
                <ShieldCheck size={30} strokeWidth={1.8} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-800">
                Secure Checkout
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enjoy a simple and secure payment experience every time.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
