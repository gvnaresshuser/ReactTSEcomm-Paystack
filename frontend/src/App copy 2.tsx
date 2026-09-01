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
import PartnerLogin from "./pages/partner/PartnerLogin";
import PartnerLayout from "./pages/partner/PartnerLayout";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import PartnerProtectedRoute from "./components/PartnerProtectedRoute";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Route>
        </Route>

        {/* Admin Layout */}
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
          </Route>
          <Route path="/partner/login" element={<PartnerLogin />} />

          <Route path="/partner" element={<PartnerProtectedRoute />}>
            <Route element={<PartnerLayout />}>
              <Route path="dashboard" element={<PartnerDashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
