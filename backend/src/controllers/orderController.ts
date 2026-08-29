import { Response } from "express";
import {
  createOrderFromItems,
  getOrdersByUser,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../models/orderModel.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });

    const order = await createOrderFromItems(userId, items);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create order",
    });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });

    const orders = await getOrdersByUser(userId);

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const getOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });

    const order = await getOrderById(userId, req.params.id as string);

    if (!order)
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });

    res.json({ success: true, order });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};

export const getAllOrdersAdmin = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const orders = await getAllOrders();

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Cancelled",
      "Packed",
      "OutForDelivery",
      "Delivered",
    ];

    if (!allowedStatuses.includes(status))
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });

    const order = await updateOrderStatus(
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
    console.error("Update order status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};