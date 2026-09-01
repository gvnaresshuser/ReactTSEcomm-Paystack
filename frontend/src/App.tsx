import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAppDispatch } from "./redux/hooks";
import { getCurrentUser } from "./redux/slices/authSlice";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";
import AdminDeliveryPartnerForm from "./pages/admin/AdminDeliveryPartnerForm";
import AdminQuotes from "./pages/admin/AdminQuotes";
import PartnerLogin from "./pages/partner/PartnerLogin";
import PartnerLayout from "./pages/partner/PartnerLayout";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import PartnerProtectedRoute from "./components/PartnerProtectedRoute";
import PartnerDeliveries from "./pages/partner/PartnerDeliveries";
import PartnerLiveTracking from "./pages/partner/PartnerLiveTracking";
//import LiveOrderTracking from "./pages/LiveOrderTracking";
import TrackOrder from "./pages/TrackOrder";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* ==================== PUBLIC ==================== */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ==================== USER ==================== */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
            {/* LIVE ORDER TRACKING */}
            {/* <Route
              path="/orders/:id/tracking"
              element={<LiveOrderTracking />}
            /> */}
            <Route path="/orders/:id/tracking" element={<TrackOrder />} />
          </Route>
        </Route>
        {/* ==================== ADMIN ==================== */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="orders" element={<AdminOrders />} />
            {/* DELIVERY PARTNERS */}
            <Route
              path="delivery-partners"
              element={<AdminDeliveryPartners />}
            />
            <Route
              path="delivery-partners/new"
              element={<AdminDeliveryPartnerForm />}
            />
            <Route
              path="delivery-partners/:id/edit"
              element={<AdminDeliveryPartnerForm />}
            />
            <Route path="quotes" element={<AdminQuotes />} />
          </Route>
        </Route>
        {/* ==================== PARTNER ==================== */}
        {/* PUBLIC PARTNER LOGIN */}
        <Route path="/partner/login" element={<PartnerLogin />} />
        {/* PROTECTED PARTNER AREA */}
        <Route path="/partner" element={<PartnerProtectedRoute />}>
          <Route element={<PartnerLayout />}>
            <Route path="dashboard" element={<PartnerDashboard />} />
            <Route path="deliveries" element={<PartnerDeliveries />} />
            <Route path="tracking/:id" element={<PartnerLiveTracking />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
