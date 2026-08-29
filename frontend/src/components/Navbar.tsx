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
  // ----------------------------------------
  // LOCAL STATE
  // ----------------------------------------

  const [menuOpen, setMenuOpen] = useState(false);

  // JWT inspector panel
  const [jwtPanelOpen, setJwtPanelOpen] = useState(false);

  // ----------------------------------------
  // REDUX / NAVIGATION
  // ----------------------------------------

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

  // Calculate total quantity of all cart items
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

  // ----------------------------------------
  // JWT DECODER
  // ----------------------------------------

  const getJwtData = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return {
        token: null,
        header: null,
        payload: null,
      };
    }

    try {
      const parts = token.split(".");

      // JWT should contain:
      // HEADER.PAYLOAD.SIGNATURE

      if (parts.length !== 3) {
        return {
          token,
          header: null,
          payload: null,
        };
      }

      const [headerPart, payloadPart] = parts;

      // ----------------------------------------
      // BASE64URL DECODER
      // ----------------------------------------

      const decodeBase64Url = (value: string) => {
        const base64 = value.replace(/-/g, "+").replace(/_/g, "/");

        const padded = base64.padEnd(
          base64.length + ((4 - (base64.length % 4)) % 4),
          "=",
        );

        return decodeURIComponent(
          atob(padded)
            .split("")
            .map(
              (char) =>
                "%" + ("00" + char.charCodeAt(0).toString(16)).slice(-2),
            )
            .join(""),
        );
      };

      return {
        token,
        header: JSON.parse(decodeBase64Url(headerPart)),
        payload: JSON.parse(decodeBase64Url(payloadPart)),
      };
    } catch {
      return {
        token,
        header: null,
        payload: null,
      };
    }
  };

  // ----------------------------------------
  // JWT DATA
  // ----------------------------------------

  const jwtData = getJwtData();

  // ----------------------------------------
  // RETURN
  // ----------------------------------------

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
              {/* ====================================
                  PRODUCTS
              ==================================== */}

              <NavLink to="/products" className={navLinkClass}>
                <Package size={17} />
                Products
              </NavLink>

              {/* ====================================
                  CART
              ==================================== */}

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

              {/* ====================================
                  ORDERS
              ==================================== */}

              <NavLink to="/orders" className={navLinkClass}>
                <ClipboardList size={17} />
                Orders
              </NavLink>

              {/* ====================================
                  USER PROFILE / JWT BUTTON
              ==================================== */}

              <button
                type="button"
                onClick={() => setJwtPanelOpen(true)}
                title="Click to inspect JWT token"
                className="ml-2 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-left transition-all duration-200 hover:border-purple-500 hover:bg-slate-800 hover:shadow-lg hover:shadow-purple-500/10"
              >
                {/* USER ICON */}

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
                  <User size={16} className="text-white" />
                </div>

                {/* USER DETAILS */}

                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-white">{user.name}</p>

                  <div className="flex items-center gap-1">
                    <ShieldCheck size={11} className="text-green-400" />

                    <p className="text-[10px] capitalize text-slate-400">
                      {user.role}
                    </p>
                  </div>
                </div>
              </button>

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
              {/* ====================================
                  LOGIN
              ==================================== */}

              <NavLink to="/login" className={navLinkClass}>
                <LogIn size={17} />
                Login
              </NavLink>

              {/* ====================================
                  REGISTER
              ==================================== */}

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

                <button
                  type="button"
                  onClick={() => setJwtPanelOpen(true)}
                  className="mt-3 flex w-full items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-left transition hover:border-purple-500 hover:bg-slate-800"
                >
                  {/* USER ICON */}

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-md">
                    <User size={20} className="text-white" />
                  </div>

                  {/* USER DETAILS */}

                  <div>
                    <p className="font-semibold text-white">{user.name}</p>

                    <div className="mt-1 flex items-center gap-1">
                      <ShieldCheck size={13} className="text-green-400" />

                      <p className="text-xs capitalize text-slate-400">
                        {user.role}
                      </p>
                    </div>

                    <p className="mt-1 text-[10px] text-purple-400">
                      Click to inspect JWT →
                    </p>
                  </div>
                </button>

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

      {/* ==================================================
          JWT DEMO SLIDING PANEL
      ================================================== */}

      {jwtPanelOpen && (
        <>
          {/* ==============================================
              BACKDROP
          ============================================== */}

          <div
            className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setJwtPanelOpen(false)}
          />

          {/* ==============================================
              SLIDING PANEL
          ============================================== */}

          {/* <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-slate-800 bg-slate-950 text-white shadow-2xl"> */}
          <aside className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-slate-800 bg-slate-950 text-white shadow-2xl">
            {/* ==========================================
                PANEL HEADER
            ========================================== */}

            <div className="flex items-center justify-between border-b border-slate-800 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-950 px-5 py-5 sm:px-6">
              <div className="flex items-center gap-3">
                {/* JWT ICON */}

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl shadow-lg shadow-purple-500/20">
                  🔐
                </div>

                <div>
                  <h2 className="text-lg font-bold">JWT Token Inspector</h2>

                  <p className="text-xs text-slate-400">Authentication Demo</p>
                </div>
              </div>

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={() => setJwtPanelOpen(false)}
                className="rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 transition hover:border-slate-500 hover:bg-slate-800 hover:text-white"
                aria-label="Close JWT inspector"
              >
                <X size={20} />
              </button>
            </div>

            {/* ==========================================
                PANEL CONTENT
            ========================================== */}

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              {/* ========================================
                  JWT EXPLANATION
              ======================================== */}

              <div className="mb-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 p-5">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🧠</div>

                  <div>
                    <h3 className="font-bold text-white">What is a JWT?</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      JSON Web Token is commonly used to securely transmit
                      authentication information between the client and server.
                    </p>
                  </div>
                </div>

                {/* JWT STRUCTURE */}

                <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  JWT Structure
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
                  <span className="rounded-lg bg-red-500/20 px-3 py-2 text-red-300 ring-1 ring-red-500/20">
                    HEADER
                  </span>

                  <span className="text-slate-600">.</span>

                  <span className="rounded-lg bg-purple-500/20 px-3 py-2 text-purple-300 ring-1 ring-purple-500/20">
                    PAYLOAD
                  </span>

                  <span className="text-slate-600">.</span>

                  <span className="rounded-lg bg-blue-500/20 px-3 py-2 text-blue-300 ring-1 ring-blue-500/20">
                    SIGNATURE
                  </span>
                </div>
              </div>

              {/* ========================================
                  TOKEN NOT FOUND
              ======================================== */}

              {!jwtData.token ? (
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-center">
                  <div className="text-4xl">⚠️</div>

                  <h3 className="mt-3 font-bold text-yellow-300">
                    JWT Token Not Found
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    No token was found in localStorage.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* ======================================
                      RAW JWT TOKEN
                  ====================================== */}

                  <section>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-purple-300">
                        🔑 Raw JWT Token
                      </h3>

                      <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-semibold text-purple-300 ring-1 ring-purple-500/20">
                        ENCODED
                      </span>
                    </div>

                    <div className="max-h-40 overflow-auto rounded-xl border border-slate-800 bg-black/50 p-4 shadow-inner">
                      <p className="break-all font-mono text-xs leading-6 text-slate-300">
                        {jwtData.token}
                      </p>
                    </div>
                  </section>

                  {/* ======================================
                      HEADER
                  ====================================== */}

                  <section>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-red-300">
                        🧩 Decoded Header
                      </h3>

                      <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold text-red-300 ring-1 ring-red-500/20">
                        HEADER
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-red-500/20 bg-black/50">
                      <pre className="overflow-auto p-4 font-mono text-xs leading-6 text-green-300">
                        {jwtData.header
                          ? JSON.stringify(jwtData.header, null, 2)
                          : "Unable to decode header"}
                      </pre>
                    </div>
                  </section>

                  {/* ======================================
                      PAYLOAD
                  ====================================== */}

                  <section>
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-purple-300">
                        👤 Decoded Payload
                      </h3>

                      <span className="rounded-full bg-purple-500/10 px-2.5 py-1 text-[10px] font-semibold text-purple-300 ring-1 ring-purple-500/20">
                        PAYLOAD
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-purple-500/20 bg-black/50">
                      <pre className="max-h-80 overflow-auto p-4 font-mono text-xs leading-6 text-blue-300">
                        {jwtData.payload
                          ? JSON.stringify(jwtData.payload, null, 2)
                          : "Unable to decode payload"}
                      </pre>
                    </div>
                  </section>

                  {/* ======================================
                      SIGNATURE EXPLANATION
                  ====================================== */}

                  <section>
                    <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-5">
                      <div className="flex gap-3">
                        <div className="text-xl">🔏</div>

                        <div>
                          <h3 className="font-bold text-blue-300">Signature</h3>

                          <p className="mt-2 text-xs leading-5 text-slate-400">
                            The signature is used by the server to verify that
                            the JWT has not been modified after it was created.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* ======================================
                      TEACHING NOTE
                  ====================================== */}

                  <div className="rounded-2xl border border-green-500/20 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 p-5">
                    <div className="flex gap-3">
                      <div className="text-xl">💡</div>

                      <div>
                        <h3 className="font-bold text-green-300">
                          JWT Teaching Point
                        </h3>

                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          The header and payload are encoded, not encrypted.
                          Anyone who possesses the JWT can decode them.
                        </p>

                        <p className="mt-2 text-xs leading-5 text-slate-400">
                          The signature helps the server verify that the token
                          was created using the expected secret or signing key
                          and has not been tampered with.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ======================================
                      JWT FLOW
                  ====================================== */}

                  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
                    <h3 className="text-sm font-bold text-white">
                      🔄 Authentication Flow
                    </h3>

                    <div className="mt-4 space-y-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                          1
                        </span>

                        <span className="text-slate-400">User logs in</span>
                      </div>

                      <div className="ml-3 h-4 border-l border-slate-700" />

                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-300">
                          2
                        </span>

                        <span className="text-slate-400">
                          Server creates JWT
                        </span>
                      </div>

                      <div className="ml-3 h-4 border-l border-slate-700" />

                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/20 text-pink-300">
                          3
                        </span>

                        <span className="text-slate-400">
                          Client stores JWT
                        </span>
                      </div>

                      <div className="ml-3 h-4 border-l border-slate-700" />

                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/20 text-green-300">
                          4
                        </span>

                        <span className="text-slate-400">
                          JWT sent with API requests
                        </span>
                      </div>

                      <div className="ml-3 h-4 border-l border-slate-700" />

                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/20 text-yellow-300">
                          5
                        </span>

                        <span className="text-slate-400">
                          Server verifies JWT
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ==========================================
                PANEL FOOTER
            ========================================== */}

            <div className="border-t border-slate-800 bg-slate-950 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => setJwtPanelOpen(false)}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/10 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Close JWT Inspector
              </button>
            </div>
          </aside>
        </>
      )}
    </nav>
  );
};

export default Navbar;
