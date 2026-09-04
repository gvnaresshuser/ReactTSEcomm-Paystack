import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchProductsPaginated,
} from "../../redux/slices/productPaginationSlice";
import {
  fetchProductCategories,
} from "../../redux/slices/productCategoriesSlice";



const AdminProducts = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    products,
    pagination,
    loading,
    error,
  } = useAppSelector(
    (state) => state.productPagination,
  );

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector(
    (state) => state.productCategories,
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 8;

  // --------------------------------------------------
  // Fetch categories
  // --------------------------------------------------

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, [dispatch]);

  // --------------------------------------------------
  // Fetch products
  // --------------------------------------------------

  useEffect(() => {
    dispatch(
      fetchProductsPaginated({
        page: currentPage,
        limit,
        search,
        category,
      }),
    );
  }, [dispatch, currentPage, search, category]);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearch = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Category
  // --------------------------------------------------

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Clear search
  // --------------------------------------------------

  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const goToPage = (page: number) => {
    if (
      page >= 1 &&
      page <= pagination.totalPages &&
      page !== currentPage
    ) {
      setCurrentPage(page);
    }
  };

  const startProduct =
    pagination.totalProducts === 0
      ? 0
      : (currentPage - 1) * limit + 1;

  const endProduct = Math.min(
    currentPage * limit,
    pagination.totalProducts,
  );

  // --------------------------------------------------
  // Initial loading
  // --------------------------------------------------

  if (loading && products.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-white/80 p-10 text-center shadow-2xl backdrop-blur-sm">
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

            <h2 className="mt-7 text-xl font-bold text-slate-800">
              Loading Products
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're fetching your products for you
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

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error) {
    return (
      <div className="p-8 text-center font-medium text-red-600">
        {error}
      </div>
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
            onClick={() =>
              navigate("/admin/products/new")
            }
            className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:from-green-600 hover:to-emerald-700 hover:shadow-lg sm:w-auto"
          >
            + Add Product
          </button>
        </div>

        {/* Search + Category */}
        <div className="mb-6 rounded-2xl bg-white p-4 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search products by name or category..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  title="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={handleCategoryChange}
              disabled={categoriesLoading}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 md:w-64"
            >
              <option value="All">
                {categoriesLoading
                  ? "Loading categories..."
                  : "All Categories"}
              </option>

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Category Error */}
          {categoriesError && (
            <p className="mt-3 text-xs font-medium text-red-600">
              {categoriesError}
            </p>
          )}

          {/* Result Count */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 sm:text-sm">
              {pagination.totalProducts} product
              {pagination.totalProducts !== 1
                ? "s"
                : ""}{" "}
              found
            </p>

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="self-start text-xs font-semibold text-blue-600 hover:text-blue-700 sm:self-auto"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Loading while changing page/filter */}
        {loading && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-medium text-blue-600 shadow-sm">
            <LoaderCircle
              size={18}
              className="animate-spin"
            />
            Loading products...
          </div>
        )}

        {/* No Products */}
        {!loading && products.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <Search
                size={28}
                className="text-slate-400"
              />
            </div>

            <h2 className="mt-4 text-lg font-bold text-slate-700">
              No products found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try searching with a different product
              name or category.
            </p>

            {(search || category !== "All") && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setCurrentPage(1);
                }}
                className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Desktop Table */}
        {products.length > 0 && (
          <div className="hidden overflow-hidden rounded-2xl bg-white shadow-md md:block">
            <table className="w-full">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="p-4 text-left">
                    Product
                  </th>

                  <th className="p-4 text-left">
                    Category
                  </th>

                  <th className="p-4 text-left">
                    Price
                  </th>

                  <th className="p-4 text-left">
                    Stock
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t transition hover:bg-slate-50"
                  >
                    {/* Product */}
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

                    {/* Category */}
                    <td className="p-4 text-slate-600">
                      {product.category || "-"}
                    </td>

                    {/* Price */}
                    <td className="p-4 font-semibold text-slate-800">
                      ₦
                      {Number(
                        product.price,
                      ).toLocaleString("en-NG")}
                    </td>

                    {/* Stock */}
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

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          product.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/products/${product.id}/edit`,
                          )
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
        {products.length > 0 && (
          <div className="space-y-4 md:hidden">
            {products.map((product) => (
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
                    {product.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* Product Information */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-4">
                  <div>
                    <p className="text-sm text-slate-500">
                      Price
                    </p>

                    <p className="font-semibold text-slate-800">
                      ₦
                      {Number(
                        product.price,
                      ).toLocaleString("en-NG")}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Stock
                    </p>

                    <p className="font-semibold text-slate-800">
                      {product.stock}
                    </p>
                  </div>
                </div>

                {/* Edit */}
                <button
                  onClick={() =>
                    navigate(
                      `/admin/products/${product.id}/edit`,
                    )
                  }
                  className="mt-4 w-full rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
                >
                  Edit Product
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-md sm:flex-row">

            {/* Range */}
            <p className="text-xs text-slate-500 sm:text-sm">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startProduct}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {endProduct}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {pagination.totalProducts}
              </span>{" "}
              products
            </p>

            {/* Controls */}
            <div className="flex items-center gap-1.5">

              {/* Previous */}
              <button
                type="button"
                onClick={() =>
                  goToPage(currentPage - 1)
                }
                disabled={currentPage === 1 || loading}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page Numbers */}
              {Array.from(
                {
                  length: pagination.totalPages,
                },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  disabled={loading}
                  className={`h-9 min-w-9 rounded-lg px-2 text-sm font-semibold transition ${
                    currentPage === page
                      ? "bg-slate-800 text-white"
                      : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {page}
                </button>
              ))}

              {/* Next */}
              <button
                type="button"
                onClick={() =>
                  goToPage(currentPage + 1)
                }
                disabled={
                  currentPage ===
                    pagination.totalPages ||
                  loading
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                title="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminProducts;

