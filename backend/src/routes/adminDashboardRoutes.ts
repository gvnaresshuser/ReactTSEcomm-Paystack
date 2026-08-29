import { Router } from "express";
import { getDashboard } from "../controllers/adminDashboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getDashboard);

export default router;