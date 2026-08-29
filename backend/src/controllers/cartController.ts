import {
    Request,
    Response
} from "express";

import {
    addToCart,
    getCart,
    updateCartItem,
    getCartItem,
    removeCartItem
} from "../models/cartModel.js";

import {
    getProductById
} from "../models/productModel.js";

import {
    AuthRequest
} from "../middleware/authMiddleware.js";


export const addCartItem =
    async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const userId =
                req.user?.userId;


            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Authentication required"

                });

            }


            const {
                productId,
                quantity
            } = req.body;


            // Validate request

            if (!productId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Product ID is required"

                });

            }


            const requestedQuantity =
                Number(quantity);


            if (
                !Number.isInteger(
                    requestedQuantity
                ) ||
                requestedQuantity <= 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Quantity must be a positive integer"

                });

            }


            // Check whether product exists

            const product =
                await getProductById(
                    productId
                );


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            // Check stock

           // Get existing cart item

const existingCartItem =
    await getCartItem(
        userId,
        productId
    );


const existingQuantity =
    existingCartItem
        ? existingCartItem.quantity
        : 0;


// Check total quantity against stock

const totalQuantity =
    existingQuantity +
    requestedQuantity;


if (
    totalQuantity >
    product.stock
) {

    return res.status(400).json({

        success: false,

        message:
            `Only ${product.stock} items available in stock. ` +
            `You already have ${existingQuantity} in your cart.`

    });

}


            // Add product to cart

            const cartItem =
                await addToCart(

                    userId,

                    productId,

                    requestedQuantity

                );


            return res.status(201).json({

                success: true,

                message:
                    "Product added to cart",

                cartItem

            });

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to add product to cart"

            });

        }

    };


    export const getCartItems =
    async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const userId =
                req.user?.userId;


            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Authentication required"

                });

            }


            const cart =
                await getCart(
                    userId
                );


            return res.status(200).json({

                success: true,

                cart

            });

        } catch (error) {

            console.error(
                "Get cart error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch cart"

            });

        }

    };

export const updateCart = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const productId = req.params.productId as string;

    const { quantity } = req.body;

    const requestedQuantity = Number(quantity);

    // Validate quantity
    if (
      !Number.isInteger(requestedQuantity) ||
      requestedQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    // Check product
    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check stock
    if (requestedQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // Update cart item
    const cartItem = await updateCartItem(
      userId,
      productId,
      requestedQuantity
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product is not in your cart",
      });
    }

    // Get updated cart
    const cart = await getCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart,
    });
  } catch (error) {
    console.error(
      "Update cart error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

    export const removeCart =
    async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const userId =
                req.user?.userId;


            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Authentication required"

                });

            }


            const productId =
                req.params.productId as string;


            const cartItem =
                await removeCartItem(
                    userId,
                    productId
                );


            if (!cartItem) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product is not in your cart"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Product removed from cart",

                cartItem

            });

        } catch (error) {

            console.error(
                "Remove cart item error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to remove product from cart"

            });

        }

    };