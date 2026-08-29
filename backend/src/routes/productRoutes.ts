import express from "express";

import {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";

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
    getProducts
);


router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    createProduct
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateProduct
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteProduct
);

router.get(
    "/:id",
    getProduct
);


export default router;