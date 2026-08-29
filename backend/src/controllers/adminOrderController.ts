import { Response } from "express";
import {
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
} from "../models/adminOrderModel.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

const allowedStatuses = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Packed",
  "OutForDelivery",
  "Delivered",
];

export const getAdminOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await getAllOrdersAdmin();

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getAdminOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await getOrderByIdAdmin(req.params.id as string);

    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Admin get order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

export const updateAdminOrderStatus = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status))
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });

    const order = await updateOrderStatusAdmin(
      req.params.id as string,
      status,
    );

    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Admin update order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};