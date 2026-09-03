import { Response } from "express";
import {
  getAllOrdersAdmin,
  getOrderByIdAdmin,
  updateOrderStatusAdmin,
  assignDeliveryPartner,
  removeDeliveryPartner,
  getPaginatedOrdersAdmin,
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

export const getPaginatedAdminOrders = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    // ================================
    // PAGE
    // ================================
    let page = Number(req.query.page) || 1;

    // ================================
    // LIMIT
    // ================================
    let limit = Number(req.query.limit) || 10;

    // Prevent invalid page
    if (page < 1) {
      page = 1;
    }

    // Prevent invalid limit
    if (limit < 1) {
      limit = 10;
    }

    // Maximum page size = 50
    if (limit > 50) {
      limit = 50;
    }

    // ================================
    // SEARCH
    // ================================
    const search = String(
      req.query.search || "",
    ).trim();

    // ================================
    // DATE/TIME
    // ================================
    const fromDateTime = req.query.fromDateTime
      ? String(req.query.fromDateTime)
      : undefined;

    const toDateTime = req.query.toDateTime
      ? String(req.query.toDateTime)
      : undefined;

    // ================================
    // DATABASE
    // ================================
    const {
      orders,
      totalOrders,
    } = await getPaginatedOrdersAdmin(
      page,
      limit,
      search,
      fromDateTime,
      toDateTime,
    );

    const totalPages =
      totalOrders === 0
        ? 0
        : Math.ceil(totalOrders / limit);

    res.json({
      success: true,

      orders,

      pagination: {
        page,
        limit,
        totalOrders,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      "Admin paginated orders error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch paginated orders",
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

export const assignAdminDeliveryPartner = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({
        success: false,
        message: "Delivery partner is required",
      });
    }

    const order = await assignDeliveryPartner(
      req.params.id as string,
      partnerId,
    );

    if (!order) {
      return res.status(400).json({
        success: false,
        message:
          "Delivery partner cannot be assigned. Online payment must be completed first. COD orders can be assigned.",
      });
    }

    res.json({
      success: true,
      message:
        "Delivery partner assigned successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Assign delivery partner error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to assign delivery partner",
    });
  }
};

export const removeAdminDeliveryPartner = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const order = await removeDeliveryPartner(
      req.params.id as string,
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Delivery partner removed successfully",
      order,
    });
  } catch (error) {
    console.error(
      "Remove delivery partner error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to remove delivery partner",
    });
  }
};