import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  ShoppingCart,
  ClipboardList,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logoutUser } from "../redux/slices/authSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ----------------------------------------
  // AUTHENTICATION STATE
  // ----------------------------------------
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  // ----------------------------------------
  // CART STATE
  // ----------------------------------------
  const cart = useAppSelector((state) => state.cart.cart);

  const cartCount = cart.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  // ----------------------------------------
  // NAVIGATION LINK STYLING
  // ----------------------------------------
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
        : "text-slate-200 hover:bg-slate-800 hover:text-white"
    }`;

  // ----------------------------------------
  // LOGOUT
  // ----------------------------------------
  const handleLogout = async () => {
    const result = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(result)) {
      setMenuOpen(false);
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 text-white shadow-xl">
      {/* ====================================
          MAIN NAVBAR
      ==================================== */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* ====================================
            LOGO
        ==================================== */}
        <NavLink
          to="/"
          end
          onClick={() => setMenuOpen(false)}
          className="group flex items-center gap-3"
        >
          {/* LOGO ICON */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg transition-transform duration-200 group-hover:scale-105">
            <ShoppingCart size={21} strokeWidth={2.5} className="text-white" />
          </div>

          {/* BRAND NAME */}
          <div className="hidden sm:block">
            <h1 className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-lg font-extrabold text-transparent sm:text-xl">
              React TS E-Commerce
            </h1>

            <p className="text-[10px] font-medium tracking-wider text-slate-500">
              SHOP • DISCOVER • ENJOY
            </p>
          </div>

          {/* MOBILE BRAND */}
          <span className="text-lg font-extrabold sm:hidden">
            React TS E-Commerce
          </span>
        </NavLink>

        {/* ====================================
            MOBILE MENU BUTTON
        ==================================== */}
        <button
          type="button"
          className="rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-slate-200 transition hover:bg-slate-800 hover:text-white md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* ====================================
            DESKTOP NAVIGATION
        ==================================== */}
        <div className="hidden items-center gap-2 md:flex">
          {/* HOME */}
          <NavLink to="/" end className={navLinkClass}>
            <Home size={17} />
            Home
          </NavLink>

          {user && (
            <>
              {/* PRODUCTS */}
              <NavLink to="/products" className={navLinkClass}>
                <Package size={17} />
                Products
              </NavLink>

              {/* CART */}
              <div className="relative">
                <NavLink to="/cart" className={navLinkClass}>
                  <ShoppingCart size={17} />
                  Cart
                </NavLink>

                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-slate-950 bg-gradient-to-r from-red-500 to-pink-500 px-1 text-[10px] font-extrabold text-white shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* ORDERS */}
              <NavLink to="/orders" className={navLinkClass}>
                <ClipboardList size={17} />
                Orders
              </NavLink>

              {/* ====================================
                  USER PROFILE
              ==================================== */}
              <div className="ml-2 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <User size={16} className="text-white" />
                </div>

                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-white">{user.name}</p>

                  <div className="flex items-center gap-1">
                    <ShieldCheck size={11} className="text-green-400" />

                    <p className="text-[10px] capitalize text-slate-400">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* ====================================
                  LOGOUT
              ==================================== */}
              <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="ml-1 flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogOut size={17} />

                {loading ? "Logging out..." : "Logout"}
              </button>
            </>
          )}

          {!user && (
            <>
              {/* LOGIN */}
              <NavLink to="/login" className={navLinkClass}>
                <LogIn size={17} />
                Login
              </NavLink>

              {/* REGISTER */}
              <NavLink to="/register" className={navLinkClass}>
                <UserPlus size={17} />
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* ====================================
          MOBILE NAVIGATION
      ==================================== */}
      {menuOpen && (
        <div className="border-t border-slate-800 bg-slate-950 px-4 pb-5 pt-4 md:hidden">
          <div className="flex flex-col gap-2">
            {/* HOME */}
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={navLinkClass}
            >
              <Home size={18} />
              Home
            </NavLink>

            {user && (
              <>
                {/* PRODUCTS */}
                <NavLink
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <Package size={18} />
                  Products
                </NavLink>

                {/* CART */}
                <NavLink
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <ShoppingCart size={18} />
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-auto flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-1.5 text-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </NavLink>

                {/* ORDERS */}
                <NavLink
                  to="/orders"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <ClipboardList size={18} />
                  Orders
                </NavLink>

                {/* ====================================
                    MOBILE USER CARD
                ==================================== */}
                <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
                    <User size={20} className="text-white" />
                  </div>

                  <div>
                    <p className="font-semibold text-white">{user.name}</p>

                    <div className="mt-1 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-green-400" />

                      <p className="text-xs capitalize text-slate-400">
                        {user.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* LOGOUT */}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={18} />

                  {loading ? "Logging out..." : "Logout"}
                </button>
              </>
            )}

            {!user && (
              <>
                {/* LOGIN */}
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <LogIn size={18} />
                  Login
                </NavLink>

                {/* REGISTER */}
                <NavLink
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className={navLinkClass}
                >
                  <UserPlus size={18} />
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
