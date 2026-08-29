import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/authSlice";

const AdminLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-4 py-3 ${
      isActive
        ? "bg-blue-600 text-white font-semibold"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className="
          w-full bg-white p-5 shadow-md
          lg:fixed lg:left-0 lg:top-0 lg:h-screen lg:w-72
        "
      >
        {/* Admin Header */}
        <div
          className="
            mb-6 flex w-full items-center justify-between
            rounded-[5px] bg-amber-300
            px-5 py-3
          "
        >
          <h1 className="whitespace-nowrap text-2xl font-bold text-slate-800">
            Admin Panel
          </h1>

          <button
            onClick={handleLogout}
            title="Logout"
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          >
            <LogOut size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex gap-2 lg:block lg:space-y-3">
          <NavLink to="/admin/dashboard" className={navClass}>
            Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={navClass}>
            Products
          </NavLink>

          <NavLink to="/admin/orders" className={navClass}>
            Orders
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className="
          p-4 sm:p-6
          lg:ml-72
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
