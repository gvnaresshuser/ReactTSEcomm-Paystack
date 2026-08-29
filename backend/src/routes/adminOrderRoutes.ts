import { Router } from "express";
import {
  getAdminOrders,
  getAdminOrder,
  updateAdminOrderStatus,
} from "../controllers/adminOrderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getAdminOrders);
router.get("/:id", getAdminOrder);
router.put("/:id/status", updateAdminOrderStatus);

export default router;