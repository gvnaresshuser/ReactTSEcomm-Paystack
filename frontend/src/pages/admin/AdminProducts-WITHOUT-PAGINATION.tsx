import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoaderCircle, Search, X } from "lucide-react";
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
  const [search, setSearch] = useState("");
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

  // Search products by name or category
  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase().trim();

    return (
      product.name.toLowerCase().includes(searchText) ||
      product.category?.toLowerCase().includes(searchText)
    );
  });

  // Loading
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-2xl backdrop-blur-sm">
            {/* ANIMATED LOADING ICON */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-xl" />

              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
                <LoaderCircle
                  size={42}
                  strokeWidth={2}
                  className="animate-spin text-blue-600"
                />
              </div>
            </div>

            {/* HEADING */}
            <h2 className="mt-7 text-xl font-bold text-slate-800">
              Loading Products
            </h2>

            {/* MESSAGE */}
            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're fetching your products for you
            </p>

            {/* ANIMATED DOTS */}
            <div className="mt-5 flex justify-center gap-1.5">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-purple-500 [animation-delay:-0.15s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-pink-500" />
            </div>

            {/* FOOTER */}
            <p className="mt-6 text-xs font-medium text-slate-400">
              Almost there...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-8 text-center font-medium text-red-600">{error}</div>
    );
  }

  return (
    <main className="w-full">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-green-600 hover:to-emerald-700 hover:shadow-lg sm:w-auto"
          >
            + Add Product
          </button>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name or category..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                title="Clear search"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Search Result Count */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500 sm:text-sm">
              {search
                ? `${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? "s" : ""
                  } found`
                : `${products.length} product${
                    products.length !== 1 ? "s" : ""
                  }`}
            </p>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* No Search Results */}
        {filteredProducts.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Search size={28} className="text-slate-400" />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-700">
              No products found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try searching with a different product name or category.
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Desktop Table */}
        {filteredProducts.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-md md:block">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
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
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t transition hover:bg-slate-50"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-contain"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
                            No Image
                          </div>
                        )}

                        <span className="font-semibold text-slate-800">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-slate-600">
                      {product.category || "-"}
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      ₦{Number(product.price).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                          product.stock === 0
                            ? "bg-red-100 text-red-700"
                            : product.stock < 10
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : product.stock < 10
                            ? `${product.stock} Low Stock`
                            : `${product.stock} In Stock`}
                      </span>
                    </td>

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
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {filteredProducts.length > 0 && (
          <div className="space-y-4 md:hidden">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg"
              >
                {/* Product Header */}
                <div className="flex items-center gap-4">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-contain"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                      No Image
                    </div>
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
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Product Information */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                  <div>
                    <p className="text-sm text-slate-500">Price</p>

                    <p className="font-semibold text-slate-800">
                      ₦{Number(product.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">Stock</p>

                    <p className="font-semibold text-slate-800">
                      {product.stock}
                    </p>
                  </div>
                </div>

                {/* Edit */}
                <button
                  onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                  className="mt-4 w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Edit Product
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminProducts;
