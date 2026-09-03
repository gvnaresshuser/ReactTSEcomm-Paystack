import express from "express";

import {
    createOrder,
    getOrders,
    getPaginatedOrders,
    getOrder,
    getAllOrdersAdmin,
    updateStatus
} from "../controllers/orderController.js";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";

import {
    adminMiddleware
} from "../middleware/adminMiddleware.js";

const router =
    express.Router();

router.get(
    "/",
    authMiddleware,
    getOrders
);

router.get( "/paginated", authMiddleware, getPaginatedOrders, );

router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    getAllOrdersAdmin
);

router.patch(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateStatus
);

router.get(
    "/:id",
    authMiddleware,
    getOrder
);



router.post(
    "/",
    authMiddleware,
    createOrder
);


export default router;