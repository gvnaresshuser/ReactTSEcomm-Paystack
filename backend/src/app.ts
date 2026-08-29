import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";

const app = express();
// JSON request body
app.use(
    express.json()
);
// CORS
app.use(
    cors({
        origin:
            env.frontendUrl,
        credentials: true
    })
);
// Cookies
app.use(
    cookieParser()
);

// Authentication routes
//POST http://localhost:5000/api/auth/register
app.use(
    "/api/auth",
    authRoutes
);
app.use(
    "/api/products",
    productRoutes
);
app.use(
    "/api/cart",
    cartRoutes
);
app.use(
    "/api/orders",
    orderRoutes
);
app.use(
    "/api/payments",
    paymentRoutes
);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);

// Test route
app.get(
    "/api/health",
    (req, res) => {
        res.json({
            success: true,
            message:
                "ReactTSEcomApp Backend is running"
        });
    }
);
export default app;