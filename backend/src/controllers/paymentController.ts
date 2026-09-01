import { Response } from "express";

import { pool } from "../config/db.js";

import {
  createPendingOrderFromLocalCart,
  verifyPaystackPayment,
} from "../models/orderModel.js";

import { AuthRequest } from "../middleware/authMiddleware.js";


// =====================================================
// CREATE PAYMENT ORDER
// =====================================================

export const createPaymentOrder = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { items, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart items are required",
      });
    }

    if (
      paymentMethod !== "Online" &&
      paymentMethod !== "COD"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const result =
      await createPendingOrderFromLocalCart(
        userId,
        items,
        paymentMethod,
      );

    return res.status(201).json({
      success: true,

      message:
        paymentMethod === "COD"
          ? "COD order created successfully"
          : "Payment order created successfully",

      order: result.order,

      paystack: result.paystack,
    });

  } catch (error) {
    console.error(
      "Create payment order error:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Failed to create payment order";

    return res.status(400).json({
      success: false,
      message,
    });
  }
};


// =====================================================
// VERIFY PAYSTACK PAYMENT
// =====================================================

export const verifyPayment = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { reference } = req.body;

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Paystack reference is required",
      });
    }

    console.log(
      "===== PAYSTACK PAYMENT VERIFICATION =====",
    );

    console.log("User ID:", userId);

    console.log("Reference:", reference);

    console.log(
      "==========================================",
    );


    // -------------------------------------------------
    // VERIFY PAYMENT WITH PAYSTACK
    // -------------------------------------------------

    const result = await verifyPaystackPayment(
      userId,
      reference,
    );


    // -------------------------------------------------
    // PAYMENT FAILED
    // -------------------------------------------------

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
        paymentStatus: result.paymentStatus,
      });
    }


    // -------------------------------------------------
    // PAYMENT SUCCESS
    // -------------------------------------------------

    return res.status(200).json({
      success: true,
      message: result.message,
      order: result.order,
    });

  } catch (error) {
  console.error(
    "Payment verification error:",
    error,
  );

  const message =
    error instanceof Error
      ? error.message
      : "Payment verification failed";

  if (message === "Order not found") {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.status(500).json({
    success: false,
    message,
  });
}
};