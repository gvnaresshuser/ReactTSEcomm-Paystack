import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

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
    return <div className="p-8 text-center">Loading product...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
            {isEdit ? "Edit Product" : "Add Product"}
          </h1>

          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            {isEdit ? "Update product information" : "Add a new product"}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl bg-white p-4 shadow-md sm:space-y-5 sm:rounded-2xl sm:p-6"
        >
          {/* Product Name */}
          <div>
            <label className="font-semibold">Product Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border p-3"
              placeholder="Product name"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold">Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="mt-2 w-full rounded-lg border p-3"
              placeholder="Product description"
            />
          </div>

          {/* Price + Stock */}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div>
              <label className="font-semibold">Price</label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                className="mt-2 w-full rounded-lg border p-3"
                placeholder="64999"
              />
            </div>

            <div>
              <label className="font-semibold">Stock</label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                className="mt-2 w-full rounded-lg border p-3"
                placeholder="10"
              />
            </div>
          </div>

          {/* Category + Image */}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <div>
              <label className="font-semibold">Category</label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border p-3"
                placeholder="Mobiles"
              />
            </div>

            <div>
              <label className="font-semibold">Image URL</label>

              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border p-3"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Active */}
          {isEdit && (
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: e.target.checked,
                  }))
                }
                className="h-4 w-4"
              />

              <span className="font-semibold">Product Active</span>
            </label>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className={`w-full rounded-lg px-6 py-3 font-semibold text-white
    disabled:opacity-60 sm:w-auto
    ${
      isEdit
        ? "bg-orange-500 hover:bg-orange-600"
        : "bg-green-600 hover:bg-green-700"
    }`}
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Product"
                  : "Create Product"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="w-full rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default AdminProductForm;
