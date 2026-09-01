import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";

const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm transition-all duration-200 lg:justify-start ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100">
      {/* SIDEBAR */}
      <aside
        className="
    w-full 
    bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200
    shadow-md
    lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen
    lg:w-72 lg:flex-col
  "
      >
        {/* ADMIN HEADER */}
        <div className="p-4 sm:p-5">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 shadow-lg sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm sm:h-11 sm:w-11">
                  <ShieldCheck size={23} />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-white sm:text-xl">
                    Admin Panel
                  </h1>

                  <p className="truncate text-xs text-blue-100">
                    Store Management
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-4 pb-4 sm:px-5">
          <p className="mb-3 hidden px-2 text-xs font-bold uppercase tracking-wider text-slate-400 lg:block">
            Management
          </p>

          <nav
            className="
              flex w-full gap-2 overflow-x-auto pb-1
              lg:block lg:space-y-2 lg:overflow-visible
            "
          >
            <NavLink to="/admin/dashboard" className={navClass}>
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/products" className={navClass}>
              <Package size={19} />
              <span>Products</span>
            </NavLink>

            <NavLink to="/admin/orders" className={navClass}>
              <ShoppingCart size={19} />
              <span>Orders</span>
            </NavLink>

            <NavLink to="/admin/delivery-partners" className={navClass}>
              <Truck size={19} />
              <span>Delivery Partners</span>
            </NavLink>
          </nav>
        </div>

        {/* FOOTER */}
        <div className="mt-auto hidden p-5 lg:block">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700">
                  Store Online
                </p>

                <p className="text-xs text-slate-500">
                  System is running normally
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-500">
            Admin Management Panel
          </p>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="w-full lg:pl-72">
        <main className="min-h-screen w-full overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
