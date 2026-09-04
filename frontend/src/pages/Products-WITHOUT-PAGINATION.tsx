import { useEffect, useMemo, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { fetchProducts } from "../redux/slices/productSlice";
import { addItemToCart } from "../redux/slices/cartSlice";

import {
  ShoppingCart,
  Search,
  Filter,
  Package,
  CheckCircle,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

const Products = () => {
  const dispatch = useAppDispatch();

  const { products, loading, error } = useAppSelector(
    (state) => state.products,
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [addedProductName, setAddedProductName] = useState("");

  const { successMessage, error: cartError } = useAppSelector(
    (state) => state.cart,
  );

  // ========================================
  // ADD PRODUCT TO CART
  // ========================================

const handleAddToCart = useCallback(
  (
    productId: string,
    productName: string,
    price: string,
    imageUrl: string | undefined,
    stock: number,
  ) => {
    dispatch(
      addItemToCart({
        productId,
        productName,
        price,
        imageUrl,
        quantity: 1,
        stock,
      }),
    );

    setAddedProductName(productName);
  },
  [dispatch],
);

  // ========================================
  // FETCH PRODUCTS
  // ========================================

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ========================================
  // PRODUCT CATEGORIES
  // ========================================

  const categories = useMemo(
    () => [
      "All",
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ],
    [products],
  );

  // ========================================
  // FILTER PRODUCTS
  // ========================================

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
          product.name.toLowerCase().includes(searchText) ||
          product.description.toLowerCase().includes(searchText);

        const matchesCategory =
          category === "All" || product.category === category;

        return matchesSearch && matchesCategory;
      }),
    [products, search, category],
  );

  // ========================================
  // LOADING
  // ========================================

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

            {/* HEADING */}
            <h2 className="mt-7 text-xl font-bold text-slate-800">
              Loading Products
            </h2>

            {/* MESSAGE */}
            <p className="mt-2 text-sm leading-6 text-slate-500">
              We're fetching the latest products for you
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

  // ========================================
  // UI
  // ========================================

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ====================================
            PAGE HEADER
        ==================================== */}

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-md">
              <Package size={23} />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
              Products
            </h1>

            {/* PRODUCT COUNT */}

            <span className="relative -bottom-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-sm font-bold text-white shadow-md">
              {filteredProducts.length}
            </span>
          </div>

          <p className="mt-3 text-sm text-slate-500 sm:text-base">
            Browse our latest products and find something you'll love.
          </p>
        </div>

        {/* ====================================
            SEARCH + CATEGORY
        ==================================== */}

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {/* SEARCH */}

          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {/* CATEGORY */}

          <div className="relative">
            <Filter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ====================================
            PRODUCT ERROR
        ==================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* ====================================
            CART SUCCESS MESSAGE
        ==================================== */}

        {successMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 shadow-sm">
            <CheckCircle size={20} className="mt-0.5 shrink-0" />

            <span>
              {addedProductName || successMessage}
              {addedProductName && " added to cart successfully!"}
            </span>
          </div>
        )}

        {/* ====================================
            CART ERROR
        ==================================== */}

        {cartError && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />

            <span>{cartError}</span>
          </div>
        )}

        {/* ====================================
            NO PRODUCTS
        ==================================== */}

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-lg sm:p-14">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-blue-100">
              <Package size={40} className="text-slate-400" />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-800">
              No Products Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              We couldn't find any products matching your search or selected
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* ====================================
             PRODUCTS GRID
          ==================================== */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* ====================================
                    PRODUCT IMAGE
                ==================================== */}

                <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Package size={60} className="text-slate-300" />
                  )}

                  {/* STOCK BADGE */}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
                      product.stock === 0
                        ? "bg-red-100 text-red-600"
                        : product.stock <= 5
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {product.stock === 0
                      ? "Out of Stock"
                      : product.stock <= 5
                        ? `Only ${product.stock} left`
                        : "In Stock"}
                  </span>
                </div>

                {/* ====================================
                    PRODUCT CONTENT
                ==================================== */}

                <div className="flex flex-1 flex-col p-5">
                  {/* CATEGORY */}

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-600">
                    {product.category || "General"}
                  </span>

                  {/* NAME */}

                  <h2 className="mt-3 line-clamp-1 text-xl font-bold text-slate-800">
                    {product.name}
                  </h2>

                  {/* DESCRIPTION */}

                  <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
                    {product.description}
                  </p>

                  {/* ====================================
                      PRICE + STOCK
                  ==================================== */}

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Price
                      </p>

                      <span className="text-2xl font-extrabold text-slate-900">
                        ₦{Number(product.price).toLocaleString("en-IN")}
                      </span>
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      {product.stock} available
                    </span>
                  </div>

                  {/* ====================================
                      ADD TO CART
                  ==================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      handleAddToCart(
                        product.id,
                        product.name,
                        product.price,
                        product.image_url,
                        product.stock,
                      )
                    }
                    disabled={product.stock === 0}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3 text-sm font-bold text-white shadow-md transition duration-200 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:from-slate-400 disabled:via-slate-400 disabled:to-slate-400 disabled:opacity-70"
                  >
                    <ShoppingCart size={18} />

                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Products;
