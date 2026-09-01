import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, Save, Truck } from "lucide-react";
import api from "../../services/api";
import Swal from "sweetalert2";
interface FormData {
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  vehicle_type: string;
  vehicle_number: string;
  license_number: string;
  status: "active" | "inactive";
  password: string;
  confirm_password: string;
}

const initialForm: FormData = {
  full_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  vehicle_type: "Bike",
  vehicle_number: "",
  license_number: "",
  status: "active",
  password: "",
  confirm_password: "",
};

const AdminDeliveryPartnerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormData>(initialForm);

  const [loading, setLoading] = useState(isEdit);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPartner = async () => {
      try {
        const response = await api.get(`/api/admin/delivery-partners/${id}`);

        const partner = response.data.deliveryPartner;

        setForm({
          full_name: partner.full_name || "",
          phone: partner.phone || "",
          email: partner.email || "",
          address: partner.address || "",
          city: partner.city || "",
          vehicle_type: partner.vehicle_type || "Bike",
          vehicle_number: partner.vehicle_number || "",
          license_number: partner.license_number || "",
          status: partner.status || "active",
          password: partner.password || "",
          confirm_password: partner.confirm_password || "",
        });
      } catch (error: any) {
        //console.error("Failed to fetch delivery partner:", error);
        //alert("Failed to load delivery partner.");
        console.error("Failed to fetch delivery partner:", error);

        await Swal.fire({
          icon: "error",
          title: "Unable to Load",
          text: "Failed to load delivery partner.",
          confirmButtonText: "OK",
          buttonsStyling: false,
          customClass: {
            popup: "rounded-2xl",
            title: "text-xl font-bold text-slate-800",
            htmlContainer: "text-sm text-slate-500",
            confirmButton:
              "rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700",
          },
        });

        navigate("/admin/delivery-partners");
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id, navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.full_name.trim()) {
      alert("Please enter the full name.");
      return;
    }

    if (!form.phone.trim()) {
      alert("Please enter the phone number.");
      return;
    }

    try {
      setSaving(true);

     /*  if (isEdit) {
        await api.put(`/api/admin/delivery-partners/${id}`, form);
      } else {
        await api.post("/api/admin/delivery-partners", form);
      } */
     //------------------------------------------
     if (!isEdit && !form.password) {
       await Swal.fire({
         icon: "warning",
         title: "Password Required",
         text: "Please enter a password for the delivery partner.",
         confirmButtonText: "OK",
         buttonsStyling: false,
         customClass: {
           popup: "rounded-2xl shadow-2xl",
           title: "text-xl font-bold text-slate-800",
           htmlContainer: "text-sm text-slate-500",
           confirmButton:
             "rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white",
         },
       });

       return;
     }
     if (form.password !== form.confirm_password) {
       await Swal.fire({
         icon: "warning",
         title: "Passwords Don't Match",
         text: "Please make sure both passwords are the same.",
         confirmButtonText: "OK",
         buttonsStyling: false,
         customClass: {
           popup: "rounded-2xl shadow-2xl",
           title: "text-xl font-bold text-slate-800",
           htmlContainer: "text-sm text-slate-500",
           confirmButton:
             "rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white",
         },
       });

       return;
     }
     //------------------------------------------
     const { confirm_password, ...partnerData } = form;
     if (isEdit) {
       await api.put(`/api/admin/delivery-partners/${id}`, partnerData);

       await Swal.fire({
         icon: "success",
         title: "Partner Updated!",
         text: "Delivery partner details have been updated successfully.",
         toast: true,
         position: "top-end",
         showConfirmButton: false,
         timer: 2500,
         timerProgressBar: true,
         background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",

         color: "#ffffff",

         customClass: {
           popup: "rounded-2xl shadow-2xl",
           title: "text-lg font-bold text-white",
           htmlContainer: "text-sm text-blue-50",
         },
       });
     } else {
       await api.post("/api/admin/delivery-partners", partnerData);

       await Swal.fire({
         icon: "success",
         title: "Partner Added!",
         text: "New delivery partner has been added successfully.",
         toast: true,
         position: "top-end",
         showConfirmButton: false,
         timer: 2500,
         timerProgressBar: true,
         background: "linear-gradient(135deg, #16a34a, #22c55e, #4ade80)",

         color: "#ffffff",

         customClass: {
           popup: "rounded-2xl shadow-2xl",
           title: "text-lg font-bold text-white",
           htmlContainer: "text-sm text-green-50",
         },
       });
     }

     navigate("/admin/delivery-partners");
     //------------------------------------------

      navigate("/admin/delivery-partners");
    } catch (error: any) {
      /*  console.error("Save delivery partner error:", error);

      alert(
        error.response?.data?.message || "Failed to save delivery partner.",
      ); */
      console.error("Save delivery partner error:", error);

      await Swal.fire({
        icon: "error",
        title: "Unable to Save",
        text:
          error.response?.data?.message || "Failed to save delivery partner.",
        confirmButtonText: "OK",
        buttonsStyling: false,
        customClass: {
          popup: "rounded-2xl",
          title: "text-xl font-bold text-slate-800",
          htmlContainer: "text-sm text-slate-500",
          confirmButton:
            "rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-red-700",
        },
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <LoaderCircle size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* BACK */}
      <button
        type="button"
        onClick={() => navigate("/admin/delivery-partners")}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        Back to Delivery Partners
      </button>

      {/* HEADER */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
          <Truck size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            {isEdit ? "Edit Delivery Partner" : "Add Delivery Partner"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {isEdit
              ? "Update partner information"
              : "Add a new member to your delivery team"}
          </p>
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-5 shadow-md sm:p-7"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* FULL NAME */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Full Name *
            </label>

            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Phone *
            </label>

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password {!isEdit && "*"}
              </label>

              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    password: e.target.value,
                  }))
                }
                placeholder={
                  isEdit ? "Leave blank to keep current" : "Enter password"
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label
                htmlFor="confirm_password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm Password {!isEdit && "*"}
              </label>

              <input
                id="confirm_password"
                type="password"
                value={form.confirm_password}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    confirm_password: e.target.value,
                  }))
                }
                placeholder="Confirm password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* CITY */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              City
            </label>

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter city"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* VEHICLE TYPE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Vehicle Type
            </label>

            <select
              name="vehicle_type"
              value={form.vehicle_type}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="Bike">Bike</option>
              <option value="Scooter">Scooter</option>
              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* VEHICLE NUMBER */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Vehicle Number
            </label>

            <input
              name="vehicle_number"
              value={form.vehicle_number}
              onChange={handleChange}
              placeholder="e.g. AP09AB1234"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* LICENSE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              License Number
            </label>

            <input
              name="license_number"
              value={form.license_number}
              onChange={handleChange}
              placeholder="Enter license number"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Status
            </label>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* ADDRESS */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={4}
              placeholder="Enter complete address"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => navigate("/admin/delivery-partners")}
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                {isEdit ? "Update Partner" : "Save Partner"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminDeliveryPartnerForm;
