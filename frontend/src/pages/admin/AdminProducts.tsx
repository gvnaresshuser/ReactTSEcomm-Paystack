import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string | null;
  category: string | null;
  stock: number;
  is_active: boolean;
}

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/admin/products");
      setProducts(response.data.products);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Admin Products
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              Manage your products
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/products/new")}
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 sm:px-5 sm:py-3"
          >
            + Add Product
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-hidden rounded-xl bg-white shadow md:block">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left">Product</th>
                <th className="p-4 text-left">Category</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-contain"
                        />
                      )}
                      <span className="font-semibold">{product.name}</span>
                    </div>
                  </td>

                  <td className="p-4">{product.category || "-"}</td>

                  <td className="p-4 font-semibold">
                    ₦{Number(product.price).toLocaleString("en-IN")}
                  </td>

                  <td className="p-4">{product.stock}</td>

                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/${product.id}/edit`)
                      }
                      className="rounded-md bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {products.map((product) => (
            <div key={product.id} className="rounded-xl bg-white p-4 shadow">
              <div className="flex items-center gap-4">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-16 w-16 rounded-lg object-contain"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold text-slate-800">
                    {product.name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {product.category || "-"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    product.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                <div>
                  <p className="text-sm text-slate-500">Price</p>
                  <p className="font-semibold">
                    ₦{Number(product.price).toLocaleString("en-IN")}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Stock</p>
                  <p className="font-semibold">{product.stock}</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                className="mt-4 w-full rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Edit Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminProducts;
