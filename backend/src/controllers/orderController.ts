import { Response } from "express";
import {
  createOrderFromItems,
  getOrdersByUser,
  getPaginatedOrdersByUser,
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


// =====================================================
// GET USER ORDERS - PAGINATED
// =====================================================
//
// GET /api/orders/paginated
//
// Query parameters:
//
// ?page=1
// &limit=10
// &search=
// &fromDateTime=
// &toDateTime=
//
// Example:
//
// /api/orders/paginated?page=2&limit=10
//
// =====================================================

export const getPaginatedOrders = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    // -----------------------------------------------
    // AUTHENTICATED USER
    // -----------------------------------------------

    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // -----------------------------------------------
    // READ QUERY PARAMETERS
    // -----------------------------------------------

    const pageParam = req.query.page;
    const limitParam = req.query.limit;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : "";

    const fromDateTime =
      typeof req.query.fromDateTime === "string"
        ? req.query.fromDateTime
        : "";

    const toDateTime =
      typeof req.query.toDateTime === "string"
        ? req.query.toDateTime
        : "";

    // -----------------------------------------------
    // PAGE
    // -----------------------------------------------

    const page = Math.max(
      1,
      Number(pageParam) || 1,
    );

    // -----------------------------------------------
    // LIMIT
    // -----------------------------------------------
    //
    // Don't allow the frontend/client to request:
    //
    // limit=100000
    //
    // We cap it at 50.
    //
    // -----------------------------------------------

    const requestedLimit =
      Number(limitParam) || 10;

    const limit = Math.min(
      Math.max(1, requestedLimit),
      50,
    );

    // -----------------------------------------------
    // VALIDATE DATE RANGE
    // -----------------------------------------------

    if (
      fromDateTime &&
      toDateTime &&
      new Date(fromDateTime).getTime() >
        new Date(toDateTime).getTime()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "From date/time cannot be later than To date/time",
      });
    }

    // -----------------------------------------------
    // GET PAGINATED ORDERS
    // -----------------------------------------------

    const result =
      await getPaginatedOrdersByUser(
        userId,
        page,
        limit,
        search,
        fromDateTime,
        toDateTime,
      );

    // -----------------------------------------------
    // RESPONSE
    // -----------------------------------------------

    return res.json({
      success: true,
      orders: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error(
      "Get paginated orders error:",
      error,
    );

    return res.status(500).json({
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