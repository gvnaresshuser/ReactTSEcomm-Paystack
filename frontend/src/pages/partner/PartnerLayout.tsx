import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  //MapPin,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Swal from "sweetalert2";

const PartnerLayout = () => {
  const navigate = useNavigate();

  const partnerData = localStorage.getItem("partner");

  const partner = partnerData ? JSON.parse(partnerData) : null;

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm transition-all duration-200 lg:justify-start ${
      isActive
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow-md"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "Logout?",
      text: "Are you sure you want to logout?",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
      buttonsStyling: false,

      customClass: {
        popup: "rounded-2xl shadow-2xl",
        title: "text-xl font-bold text-slate-800",
        htmlContainer: "text-sm text-slate-500",
        confirmButton:
          "mx-1 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700",
        cancelButton:
          "mx-1 rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-300",
      },
    });

    if (!result.isConfirmed) return;

    localStorage.removeItem("partnerToken");
    localStorage.removeItem("partner");

    navigate("/partner/login", {
      replace: true,
    });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-100">
      {/* SIDEBAR */}
      <aside
        className="
          w-full
          bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-200
          shadow-md
          lg:fixed lg:left-0 lg:top-0
          lg:flex lg:h-screen lg:w-72
          lg:flex-col
        "
      >
        {/* HEADER */}
        <div className="p-4 sm:p-5">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-4 shadow-lg sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
                  <Truck size={24} />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-white">
                    Partner Portal
                  </h1>

                  <p className="truncate text-xs text-blue-100">
                    Delivery Management
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>
        </div>

        {/* PARTNER INFO */}
        <div className="px-4 pb-4 sm:px-5">
          <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                {partner?.full_name?.charAt(0)?.toUpperCase() || "P"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-800">
                  {partner?.full_name || "Delivery Partner"}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {partner?.phone || ""}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="px-4 pb-4 sm:px-5">
          <p className="mb-3 hidden px-2 text-xs font-bold uppercase tracking-wider text-slate-400 lg:block">
            Delivery
          </p>

          <nav
            className="
              flex w-full gap-2 overflow-x-auto pb-1
              lg:block lg:space-y-2 lg:overflow-visible
            "
          >
            <NavLink to="/partner/dashboard" className={navClass}>
              <LayoutDashboard size={19} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/partner/deliveries" className={navClass}>
              <Package size={19} />
              <span>My Deliveries</span>
            </NavLink>

            {/* <NavLink to="/partner/tracking" className={navClass}>
              <MapPin size={19} />
              <span>Live Tracking</span>
            </NavLink> */}
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
                  Partner Online
                </p>

                <p className="text-xs text-slate-500">Ready for deliveries</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-1 text-xs text-slate-400">
            <ShieldCheck size={13} />
            Secure Partner Portal
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="w-full lg:pl-72">
        <main className="min-h-screen w-full overflow-x-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PartnerLayout;
