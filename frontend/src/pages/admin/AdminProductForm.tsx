import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import {
  LoaderCircle,
  Package,
  FileText,
  IndianRupee,
  Boxes,
  Tag,
  Image,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft,
} from "lucide-react";

interface FormData {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  category: string;
  stock: string;
  isActive: boolean;
}

const initialForm: FormData = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  category: "",
  stock: "",
  isActive: true,
};

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/api/admin/products/${id}`);
        const product = response.data.product;

        setForm({
          name: product.name,
          description: product.description || "",
          price: String(product.price),
          imageUrl: product.image_url || "",
          category: product.category || "",
          stock: String(product.stock),
          isActive: product.is_active,
        });
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || form.price === "" || form.stock === "") {
      setError("Name, price and stock are required");
      return;
    }

    if (Number(form.price) < 0 || Number(form.stock) < 0) {
      setError("Price and stock cannot be negative");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        imageUrl: form.imageUrl || null,
        category: form.category || null,
        stock: Number(form.stock),
        isActive: form.isActive,
      };

      if (isEdit) {
        await api.put(`/api/admin/products/${id}`, data);
      } else {
        await api.post("/api/admin/products", data);
      }

      navigate("/admin/products");
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-2xl backdrop-blur-sm">
            {/* ANIMATED LOADING ICON */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              {/* Animated Glow */}
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl" />

              {/* Icon Container */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
                <LoaderCircle
                  size={42}
                  strokeWidth={2}
                  className="animate-spin text-blue-600"
                />
              </div>
            </div>

            <h2 className="mt-7 text-xl font-bold text-slate-800">
              Loading Product Information
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're fetching your product information
            </p>

            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" />
            </div>

            <p className="mt-6 text-xs font-medium text-slate-400">
              Almost there...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* HEADER */}
        <div className="mb-6 flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              {isEdit ? "Edit Product" : "Add Product"}
            </h1>

            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              {isEdit
                ? "Update your product information"
                : "Add a new product to your store"}
            </p>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold">Unable to save product</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          {/* FORM HEADER */}
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                <Package size={23} />
              </div>

              <div>
                <h2 className="font-bold text-slate-800">
                  Product Information
                </h2>

                <p className="text-sm text-slate-500">
                  Enter the details of your product
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7 p-5 sm:p-8">
            {/* BASIC INFORMATION */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />

                <h3 className="font-bold text-slate-800">Basic Information</h3>
              </div>

              {/* PRODUCT NAME */}
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Product Name
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <div className="relative mt-2">
                  <Package
                    size={19}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. iPhone 17 Pro"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-5">
                <label className="text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe the product, its features and benefits..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </section>

            {/* PRICING & INVENTORY */}
            <section className="border-t border-slate-100 pt-7">
              <div className="mb-4 flex items-center gap-2">
                <IndianRupee size={18} className="text-green-600" />

                <h3 className="font-bold text-slate-800">
                  Pricing & Inventory
                </h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* PRICE */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Price
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative mt-2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
                      ₦
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      placeholder="64999"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />
                  </div>
                </div>

                {/* STOCK */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Stock
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative mt-2">
                    <Boxes
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      min="0"
                      placeholder="10"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* CATEGORY & IMAGE */}
            <section className="border-t border-slate-100 pt-7">
              <div className="mb-4 flex items-center gap-2">
                <Tag size={18} className="text-purple-600" />

                <h3 className="font-bold text-slate-800">Category & Image</h3>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* CATEGORY */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <div className="relative mt-2">
                    <Tag
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      placeholder="e.g. Mobiles"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* IMAGE URL */}
                <div>
                  <label className="text-sm font-semibold text-slate-700">
                    Image URL
                  </label>

                  <div className="relative mt-2">
                    <Image
                      size={19}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      name="imageUrl"
                      value={form.imageUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
                    />
                  </div>
                </div>
              </div>

              {/* IMAGE PREVIEW */}
              {form.imageUrl && (
                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-3 text-sm font-semibold text-slate-600">
                    Image Preview
                  </p>

                  <div className="flex h-48 items-center justify-center rounded-xl bg-white">
                    <img
                      src={form.imageUrl}
                      alt="Product preview"
                      className="h-full max-w-full object-contain p-3"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ACTIVE STATUS */}
            {isEdit && (
              <section className="border-t border-slate-100 pt-7">
                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        form.isActive
                          ? "bg-green-100 text-green-600"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      <CheckCircle2 size={21} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Product Status
                      </p>

                      <p className="text-sm text-slate-500">
                        {form.isActive
                          ? "Product is visible to customers"
                          : "Product is currently hidden"}
                      </p>
                    </div>
                  </div>

                  {/* TOGGLE */}
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: !prev.isActive,
                      }))
                    }
                    className={`relative h-7 w-12 rounded-full transition ${
                      form.isActive ? "bg-green-500" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        form.isActive ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </section>
            )}

            {/* BUTTONS */}
            <div className="border-t border-slate-100 pt-7">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
                >
                  <ArrowLeft size={18} />
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
                    isEdit
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={19} />
                      {isEdit ? "Update Product" : "Create Product"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* FOOTER NOTE */}
        <p className="mt-4 text-center text-xs text-slate-400">
          Fields marked with <span className="text-red-500">*</span> are
          required
        </p>
      </div>
    </main>
  );
};

export default AdminProductForm;
