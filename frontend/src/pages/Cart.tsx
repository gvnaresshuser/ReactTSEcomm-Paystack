import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  increaseQuantity,
  decreaseQuantity,
  removeItemFromCart,
} from "../redux/slices/cartSlice";

import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Package,
} from "lucide-react";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cart, error } = useAppSelector((state) => state.cart);

  const items = cart.items;

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // ========================================
  // EMPTY CART
  // ========================================

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* TOP GRADIENT */}
            <div className="h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

            <div className="p-8 text-center sm:p-12">
              {/* CART ICON */}
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
                <ShoppingCart
                  size={54}
                  strokeWidth={1.7}
                  className="text-blue-600"
                />
              </div>

              {/* HEADING */}
              <h1 className="mt-8 text-3xl font-extrabold text-slate-800 sm:text-4xl">
                Your Cart is Empty
              </h1>

              {/* MESSAGE */}
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
                Looks like you haven't added anything to your cart yet. Explore
                our products and find something you'll love!
              </p>

              {/* BUTTON */}
              <Link
                to="/products"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-200 hover:scale-[1.03] hover:shadow-xl"
              >
                <ShoppingBag size={19} />
                Start Shopping
                <ArrowRight size={18} />
              </Link>

              {/* FOOTER */}
              <p className="mt-6 text-xs text-slate-400">
                Discover our latest products and great deals.
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // CART PAGE
  // ========================================

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ====================================
            PAGE HEADER
        ==================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold text-slate-800 sm:text-4xl">
                Shopping Cart
              </h1>

              {/* ITEM COUNT BADGE */}
              <span className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-sm font-bold text-white shadow">
                {totalItems}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Review the products in your cart before checkout
            </p>
          </div>

          {/* CONTINUE SHOPPING */}
          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
          >
            <ShoppingBag size={18} />
            Continue Shopping
          </Link>
        </div>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            {error}
          </div>
        )}

        {/* ====================================
            CART + SUMMARY
        ==================================== */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ====================================
              CART ITEMS
          ==================================== */}

          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    {/* PRODUCT IMAGE */}

                    <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 sm:h-32 sm:w-32">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-full w-full object-contain p-2 transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <Package size={45} className="text-slate-300" />
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}

                    <div className="min-w-0 flex-1">
                      {/* NAME + REMOVE */}

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                            {item.product_name}
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            ₦{Number(item.price).toLocaleString("en-IN")} per
                            item
                          </p>
                        </div>

                        {/* REMOVE */}

                        <button
                          type="button"
                          onClick={() =>
                            dispatch(removeItemFromCart(item.product_id))
                          }
                          title="Remove item"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* BOTTOM ROW */}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                        {/* QUANTITY */}

                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Quantity
                          </p>

                          <div className="flex w-fit items-center overflow-hidden rounded-xl border border-slate-300 bg-slate-50">
                            {/* DECREASE */}

                            <button
                              type="button"
                              disabled={item.quantity <= 1}
                              onClick={() =>
                                dispatch(decreaseQuantity(item.product_id))
                              }
                              className="flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Minus size={16} />
                            </button>

                            {/* QUANTITY */}

                            <span className="flex h-10 min-w-12 items-center justify-center border-x border-slate-300 bg-white px-3 text-sm font-bold text-slate-800">
                              {item.quantity}
                            </span>

                            {/* INCREASE */}

                            <button
                              type="button"
                              disabled={item.quantity >= item.stock}
                              onClick={() =>
                                dispatch(increaseQuantity(item.product_id))
                              }
                              className="flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          {item.quantity >= item.stock && (
                            <p className="mt-1 text-xs text-red-600">
                              Only {item.stock} available
                            </p>
                          )}
                        </div>

                        {/* SUBTOTAL */}

                        <div className="text-right">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Subtotal
                          </p>

                          <p className="mt-1 text-xl font-extrabold text-blue-600">
                            ₦{Number(item.subtotal).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* ====================================
              ORDER SUMMARY
          ==================================== */}

          <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            {/* SUMMARY HEADER */}

            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <ShoppingCart size={22} />

                <h2 className="text-xl font-bold">Order Summary</h2>
              </div>

              <p className="mt-1 text-sm text-blue-100">
                Review your order details
              </p>
            </div>

            <div className="p-6">
              {/* ITEMS */}

              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={18} className="text-slate-400" />

                  <span className="text-sm text-slate-600">Total Items</span>
                </div>

                <span className="font-bold text-slate-800">{totalItems}</span>
              </div>

              {/* PRICE */}

              <div className="mt-5 flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-800">
                  Total
                </span>

                <span className="text-2xl font-extrabold text-blue-600">
                  ₦{Number(cart.total).toLocaleString("en-IN")}
                </span>
              </div>

              {/* CHECKOUT */}

              <button
                type="button"
                onClick={() => navigate("/checkout")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg transition duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </button>

              {/* CONTINUE SHOPPING */}

              <Link
                to="/products"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <ShoppingBag size={17} />
                Continue Shopping
              </Link>

              {/* SECURE MESSAGE */}

              <div className="mt-5 rounded-xl bg-green-50 p-3 text-center">
                <p className="text-xs font-medium text-green-700">
                  🔒 Secure checkout • Safe &amp; trusted
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
