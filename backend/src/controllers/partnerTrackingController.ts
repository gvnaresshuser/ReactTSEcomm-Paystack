import { Response } from "express";
import { PartnerAuthRequest } from "../middleware/partnerAuthMiddleware.js";
import { addTrackingPoint } from "../models/partnerTrackingModel.js";
/* import {
  getTrackingPoints,
} from "../models/partnerTrackingModel.js"; */
 import {
  getTrackingData,
} from "../models/partnerTrackingModel.js";
export const addPartnerTrackingPoint = async (
  req: PartnerAuthRequest,
  res: Response,
) => {
  try {
    const { order_id, latitude, longitude } = req.body;

    const partnerId = req.partner?.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Partner authentication required.",
      });
    }

    if (
      !order_id ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Order ID, latitude and longitude are required.",
      });
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude.",
      });
    }

    const trackingPoint =
      await addTrackingPoint(
        partnerId,
        order_id,
        lat,
        lng,
      );

    if (!trackingPoint) {
      return res.status(403).json({
        success: false,
        message:
          "You are not assigned to this order or delivery has not started.",
      });
    }

    res.status(201).json({
      success: true,
      trackingPoint,
    });
  } catch (error) {
    console.error(
      "Add tracking point error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to save tracking location.",
    });
  }
};

/* export const getPartnerTrackingPoints = async (
  req: PartnerAuthRequest,
  res: Response,
) => {
  try {
    const partnerId =
      req.partner?.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message:
          "Partner authentication required.",
      });
    }

    const { orderId } = req.params;

    const result = await getTrackingPoints(
      partnerId,
      orderId as string,
    );

    return res.json({
      success: true,
      points: result,
    });

  } catch (error) {
    console.error(
      "Get tracking points error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch tracking points.",
    });
  }
}; */

export const getPartnerTrackingPoints = async (
  req: PartnerAuthRequest,
  res: Response,
) => {
  try {
    const partnerId =
      req.partner?.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message:
          "Partner authentication required.",
      });
    }

    const orderId =
      req.params.orderId as string;

    const result =
      await getTrackingData(
        partnerId,
        orderId,
      );

    if (!result) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found or not assigned to this partner.",
      });
    }

    return res.json({
      success: true,

      order: {
        id: result.id,
        status: result.status,
      },

      points: result.points,
    });

  } catch (error) {
    console.error(
      "Get tracking data error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch tracking data.",
    });
  }
};