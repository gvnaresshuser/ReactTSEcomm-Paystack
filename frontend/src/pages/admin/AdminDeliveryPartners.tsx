import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck,
  Plus,
  Pencil,
  Trash2,
  Search,
  LoaderCircle,
  Phone,
  MapPin,
} from "lucide-react";
import api from "../../services/api";
import Swal from "sweetalert2";
interface DeliveryPartner {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  vehicle_type: string | null;
  vehicle_number: string | null;
  license_number: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

const AdminDeliveryPartners = () => {
  const navigate = useNavigate();

  const [partners, setPartners] = useState<DeliveryPartner[]>([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPartners = async () => {
    try {
      const response = await api.get("/api/admin/delivery-partners");

      setPartners(response.data.deliveryPartners);
    } catch (error) {
      console.error("Failed to fetch delivery partners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

const handleDelete = async (id: string) => {
  const partner = partners.find((item) => item.id === id);

  const result = await Swal.fire({
    title: "Delete Delivery Partner?",
    text: `Are you sure you want to delete ${partner?.full_name || "this delivery partner"}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    buttonsStyling: false,

    customClass: {
      popup: "rounded-2xl",
      title: "text-xl font-bold",
      htmlContainer: "text-sm text-slate-500",
      confirmButton:
        "rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white mx-2",
      cancelButton:
        "rounded-xl bg-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 mx-2",
    },
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/api/admin/delivery-partners/${id}`);

    setPartners((current) => current.filter((partner) => partner.id !== id));

   await Swal.fire({
     icon: "success",
     title: "Deleted!",
     text: "Delivery partner has been deleted successfully.",
     confirmButtonText: "OK",
     buttonsStyling: false,

     background: "linear-gradient(135deg, #991b1b, #dc2626, #ef4444)",

     color: "#ffffff",

     customClass: {
       popup: "rounded-2xl shadow-2xl",
       title: "text-xl font-bold text-white",
       htmlContainer: "text-sm text-red-50",
       confirmButton:
         "rounded-xl bg-white px-6 py-3 text-sm font-semibold text-red-600 shadow-md hover:bg-red-50",
     },
   });
  } catch (error: any) {
    console.error("Delete delivery partner error:", error);

    Swal.fire({
      icon: "error",
      title: "Delete Failed",
      text:
        error.response?.data?.message || "Failed to delete delivery partner.",
      confirmButtonText: "OK",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl",
        title: "text-xl font-bold",
        confirmButton:
          "rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white",
      },
    });
  }
};

  const filteredPartners = partners.filter((partner) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      partner.full_name.toLowerCase().includes(searchText) ||
      partner.phone.includes(searchText) ||
      partner.city?.toLowerCase().includes(searchText) ||
      partner.vehicle_number?.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoaderCircle size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <Truck size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Delivery Partners
            </h1>

            <p className="text-sm text-slate-500">Manage your delivery team</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/delivery-partners/new")}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus size={19} />
          Add Partner
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
        <div className="relative">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, city or vehicle..."
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden overflow-hidden rounded-2xl bg-white shadow-md md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Partner
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Vehicle
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  City
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPartners.map((partner) => (
                <tr key={partner.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">
                      {partner.full_name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {partner.email || "No email"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {partner.phone}
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {partner.vehicle_type || "-"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {partner.vehicle_number || "-"}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {partner.city || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        partner.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {partner.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/delivery-partners/${partner.id}/edit`,
                          )
                        }
                        title="Edit"
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(partner.id)}
                        title="Delete"
                        className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="grid gap-4 md:hidden">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="rounded-2xl bg-white p-5 shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate font-bold text-slate-800">
                  {partner.full_name}
                </h2>

                <p className="mt-1 truncate text-sm text-slate-500">
                  {partner.email || "No email"}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  partner.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {partner.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone size={16} />
                {partner.phone}
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Truck size={16} />

                {partner.vehicle_type || "-"}

                {partner.vehicle_number && ` • ${partner.vehicle_number}`}
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={16} />
                {partner.city || "-"}
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
                onClick={() =>
                  navigate(`/admin/delivery-partners/${partner.id}/edit`)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                onClick={() => handleDelete(partner.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredPartners.length === 0 && (
        <div className="rounded-2xl bg-white p-10 text-center shadow-md">
          <Truck size={42} className="mx-auto text-slate-300" />

          <p className="mt-3 font-semibold text-slate-600">
            {search
              ? "No delivery partners match your search"
              : "No delivery partners found"}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryPartners;
