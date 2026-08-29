import { Router } from "express";

import {
  getProductsAdmin,
  getProductAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminProductController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get("/", getProductsAdmin);
router.get("/:id", getProductAdmin);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;