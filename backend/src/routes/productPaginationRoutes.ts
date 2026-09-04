import express from "express";

import {
  getProductsWithPagination,
} from "../controllers/productPaginationController.js";

const router = express.Router();

router.get(
  "/",
  getProductsWithPagination,
);

export default router;