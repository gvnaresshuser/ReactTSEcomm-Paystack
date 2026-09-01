import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useState } from "react";
import api from "../services/api";
import { clearCart } from "../redux/slices/cartSlice";
import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  LockKeyhole,
  Package,
  ShoppingCart,
  Truck,
} from "lucide-react";

import PaystackPop from "@paystack/inline-js";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { cart } = useAppSelector((state) => state.cart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"Online" | "COD">(
    "Online",
  );

  const items = cart.items;

  /* const testDuplicateVerification = async () => {
    try {
      const response = await api.post("/api/payments/verify", {
        reference: "4c31e9ac-388a-42b6-8910-f5209b737f75",
      });

      console.log(
        "Duplicate verification response:",
        JSON.stringify(response.data, null, 2),
      );
    } catch (error) {
      console.error("Duplicate verification error:", error);
    }
  };
 const testInvalidReference = async () => {
   try {
     const response = await api.post("/api/payments/verify", {
       reference: "fake-reference-12345",
     });

     console.log(
       "Invalid reference response:",
       JSON.stringify(response.data, null, 2),
     );
   } catch (error: any) {
     console.error(
       "Invalid reference response:",
       JSON.stringify(error.response?.data || error.message, null, 2),
     );
   }
 }; */

  // ----------------------------------------
  // EMPTY CART
  // ----------------------------------------

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl border border-white/60 bg-white/90 p-8 text-center shadow-2xl backdrop-blur sm:p-12">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-inner">
              <ShoppingCart
                size={48}
                strokeWidth={1.8}
                className="text-blue-600"
              />
            </div>

            <h1 className="mt-7 text-3xl font-bold text-slate-800 sm:text-4xl">
              Your Cart is Empty
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
              Add some amazing products to your cart before proceeding to
              checkout.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:shadow-xl"
            >
              <ShoppingCart size={19} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // ----------------------------------------
  // PROCEED TO PAYMENT
  // ----------------------------------------

  const handleProceedToPayment = async () => {
    try {
      setLoading(true);
      setError(null);

      // --------------------------------------
      // CREATE ORDER
      // --------------------------------------

      const response = await api.post("/api/payments/create-order", {
        items: items.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
        })),

        paymentMethod,
      });

      const { order, paystack } = response.data;

      // --------------------------------------
      // COD
      // --------------------------------------

      if (paymentMethod === "COD") {
        console.log("COD order created:", order);

        dispatch(clearCart());

        setLoading(false);

        navigate("/orders");

        return;
      }

      // --------------------------------------
      // ONLINE PAYMENT
      // --------------------------------------

      if (!paystack?.access_code) {
        throw new Error("Paystack payment could not be initialized.");
      }

      console.log("===== PAYSTACK CHECKOUT =====");

      console.log("Order ID:", order.id);

      console.log("Reference:", paystack.reference);

      console.log("Access Code:", paystack.access_code);

      console.log("============================");

      // --------------------------------------
      // OPEN PAYSTACK
      // --------------------------------------

      const paystackPop = new PaystackPop();

      paystackPop.resumeTransaction(paystack.access_code, {
        onSuccess: async (transaction) => {
          try {
            console.log("Paystack transaction:", transaction);

            // --------------------------------
            // VERIFY PAYMENT
            // --------------------------------

            const verifyResponse = await api.post("/api/payments/verify", {
              reference: transaction.reference,
            });

            if (verifyResponse.data.success) {
              dispatch(clearCart());

              setLoading(false);

              navigate("/payment-success");
            } else {
              setError(
                verifyResponse.data.message || "Payment verification failed",
              );

              setLoading(false);
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);

            setError(
              error.response?.data?.message || "Payment verification failed",
            );

            setLoading(false);
          }
        },

        onCancel: () => {
          console.log("Paystack payment cancelled");

          setLoading(false);

          setError("Payment was cancelled.");
        },
      });
    } catch (error: any) {
      console.error("Order/payment initiation error:", error);

      const message = error.response?.data?.message || "Unable to create order";

      setError(message);

      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* <button
          onClick={testDuplicateVerification}
          className="bg-red-500 text-white px-4 py-2"
        >
          Test Duplicate Verification
        </button><br/>
        <button
          onClick={testInvalidReference}
          className="bg-red-500 text-white px-4 py-2"
        >
          Test Invalid Reference
        </button> */}

        {/* ====================================
            PAGE HEADER
        ==================================== */}

        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
              <CreditCard size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-800 sm:text-4xl">
                Checkout
              </h1>

              <p className="mt-1 text-sm text-slate-500 sm:text-base">
                Review your order before making payment
              </p>
            </div>
          </div>
        </div>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-red-700 shadow-sm">
            <span className="mt-0.5 text-lg">⚠️</span>

            <div>
              <p className="font-semibold">Payment Error</p>

              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* ====================================
            CHECKOUT GRID
        ==================================== */}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ====================================
              ORDER ITEMS
          ==================================== */}

          <section className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl backdrop-blur">
              <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Package size={21} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      Your Order
                    </h2>

                    <p className="text-sm text-slate-500">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  {totalItems}
                </span>
              </div>

              {/* PRODUCTS */}

              <div className="divide-y divide-slate-200 px-5 sm:px-6">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center"
                  >
                    {/* PRODUCT IMAGE */}

                    <div className="group flex h-28 w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 sm:h-28 sm:w-28 sm:shrink-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <Package size={40} className="text-slate-300" />
                      )}
                    </div>

                    {/* PRODUCT DETAILS */}

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-slate-800">
                        {item.product_name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        ₦{Number(item.price).toLocaleString("en-NG")} each
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* SUBTOTAL */}

                    <div className="rounded-xl bg-slate-50 px-4 py-3 text-left sm:min-w-32 sm:text-right">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Subtotal
                      </p>

                      <p className="mt-1 text-lg font-bold text-slate-900">
                        ₦{Number(item.subtotal).toLocaleString("en-NG")}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* BACK TO CART */}

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
            >
              <ArrowLeft size={18} />
              Back to Cart
            </button>
          </section>

          {/* ====================================
              ORDER SUMMARY
          ==================================== */}

          <aside className="h-fit overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-xl backdrop-blur">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-6 py-5 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <ShoppingCart size={21} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">Order Summary</h2>

                  <p className="text-xs text-white/80">Secure checkout</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* ITEMS */}

              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <span className="text-slate-600">Items</span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-800">
                  {totalItems}
                </span>
              </div>

              {/* SUBTOTAL */}

              <div className="mt-5 flex justify-between">
                <span className="text-slate-600">Subtotal</span>

                <span className="font-semibold text-slate-800">
                  ₦{Number(cart.total).toLocaleString("en-NG")}
                </span>
              </div>

              {/* SHIPPING */}

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Truck size={17} className="text-green-600" />

                  <span className="text-slate-600">Shipping</span>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  FREE
                </span>
              </div>
              {/* PAYMENT METHOD */}

              <div className="mt-6">
                <h3 className="mb-3 text-sm font-bold text-slate-800">
                  Payment Method
                </h3>

                <div className="space-y-3">
                  {/* ONLINE PAYMENT */}

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                      paymentMethod === "Online"
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === "Online"}
                      onChange={() => setPaymentMethod("Online")}
                      className="h-4 w-4"
                    />

                    <CreditCard size={20} className="text-blue-600" />

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Pay Online
                      </p>

                      <p className="text-xs text-slate-500">
                        Secure payment through Paystack
                      </p>
                    </div>
                  </label>

                  {/* COD */}

                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                      paymentMethod === "COD"
                        ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="h-4 w-4"
                    />

                    <Truck size={20} className="text-green-600" />

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Cash on Delivery
                      </p>

                      <p className="text-xs text-slate-500">
                        Pay cash when your order is delivered
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* TOTAL */}

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-800">
                    Total
                  </span>

                  <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                    ₦{Number(cart.total).toLocaleString("en-NG")}
                  </span>
                </div>
              </div>

              {/* PAYMENT BUTTON */}

              <button
                type="button"
                disabled={loading}
                onClick={handleProceedToPayment}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-4 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {/* {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Opening Payment...
                  </>
                ) : (
                  <>
                    <CreditCard size={19} />
                    Proceed to Payment
                  </>
                )} */}
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {paymentMethod === "COD"
                      ? "Placing Order..."
                      : "Opening Payment..."}
                  </>
                ) : (
                  <>
                    {paymentMethod === "COD" ? (
                      <Truck size={19} />
                    ) : (
                      <CreditCard size={19} />
                    )}

                    {paymentMethod === "COD"
                      ? "Place Order"
                      : "Proceed to Payment"}
                  </>
                )}
              </button>

              {/* SECURITY MESSAGE */}

              <div className="mt-5 flex items-center justify-center gap-2 text-center">
                <LockKeyhole size={15} className="text-green-600" />

                <p className="text-xs text-slate-500">
                  {paymentMethod === "COD"
                    ? "Pay cash when your order is delivered"
                    : "Secure payment powered by Paystack"}
                </p>
              </div>

              {/* TRUST INDICATOR */}

              <div className="mt-5 flex items-center justify-center gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400">
                <CheckCircle size={15} className="text-green-500" />

                <span>Your payment information is securely processed</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
