import { Router } from "express";

import {
  getAdminOrders,
  getAdminOrder,
  updateAdminOrderStatus,
  assignAdminDeliveryPartner,
  removeAdminDeliveryPartner,
} from "../controllers/adminOrderController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getAdminOrders);

router.get("/:id", getAdminOrder);

router.put("/:id/status", updateAdminOrderStatus);

router.put(
  "/:id/delivery-partner",
  assignAdminDeliveryPartner,
);

router.delete(
  "/:id/delivery-partner",
  removeAdminDeliveryPartner,
);

export default router;