import { Response } from "express";
import { PartnerAuthRequest } from "../middleware/partnerAuthMiddleware.js";

import {
  getPartnerDeliveries,startPartnerDelivery,completePartnerDelivery,getPartnerTrackingPoints
} from "../models/partnerDeliveryModel.js";


export const getMyDeliveries = async (
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

    const deliveries =
      await getPartnerDeliveries(
        partnerId,
      );

    res.json({
      success: true,
      deliveries,
    });
  } catch (error) {
    console.error(
      "Get partner deliveries error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch deliveries.",
    });
  }
};
export const startDelivery = async (
  req: PartnerAuthRequest,
  res: Response,
) => {
  try {
    const partnerId = req.partner?.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Partner authentication required.",
      });
    }

    const order = await startPartnerDelivery(
      partnerId,
      req.params.id as string,
    );

    if (!order) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to start this delivery. Check the order assignment or status.",
      });
    }

    res.json({
      success: true,
      message: "Delivery started successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Start delivery error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to start delivery.",
    });
  }
};

export const completeDelivery = async (
  req: PartnerAuthRequest,
  res: Response,
) => {
  try {
    const partnerId = req.partner?.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Partner authentication required.",
      });
    }

    const orderId = req.params.id as string;

    const order = await completePartnerDelivery(
      partnerId,
      orderId,
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Delivery not found, not assigned to you, or already completed.",
      });
    }

    res.json({
      success: true,
      message: "Delivery completed successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Complete partner delivery error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to complete delivery.",
    });
  }
};
export const getTrackingPoints = async (
  req: PartnerAuthRequest,
  res: Response,
) => {
  try {
    const partnerId = req.partner?.partnerId;

    if (!partnerId) {
      return res.status(401).json({
        success: false,
        message: "Partner authentication required.",
      });
    }

    const orderId = req.params.id as string;

    const points = await getPartnerTrackingPoints(
      partnerId,
      orderId,
    );

    res.json({
      success: true,
      points,
    });
  } catch (error) {
    console.error(
      "Get tracking points error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch tracking points.",
    });
  }
};