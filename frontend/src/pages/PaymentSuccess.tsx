import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 text-center shadow-md sm:p-12">
          <div className="mb-5 text-6xl">✅</div>

          <h1 className="text-3xl font-bold text-green-600">
            Payment Successful!
          </h1>

          <p className="mt-4 text-lg text-slate-700">
            Thank you for your purchase.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Your payment has been verified successfully and your order has been
            placed.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/orders"
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;
