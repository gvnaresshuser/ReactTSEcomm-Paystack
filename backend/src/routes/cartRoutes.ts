import express from "express";

import {
    addCartItem,
    getCartItems,
    updateCart,
    removeCart
} from "../controllers/cartController.js";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";


const router =
    express.Router();


router.get(
    "/",
    authMiddleware,
    getCartItems
);


router.post(
    "/",
    authMiddleware,
    addCartItem
);

router.put(
    "/:productId",
    authMiddleware,
    updateCart
);

router.delete(
    "/:productId",
    authMiddleware,
    removeCart
);
export default router;