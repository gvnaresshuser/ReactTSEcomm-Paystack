import { Request, Response } from "express";
import { createQuoteRequest,getAllQuoteRequests } from "../models/quoteRequestModel.js";

export const submitQuoteRequest = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      service,
      shipping,
      shipment_size,
      message,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !email ||
      !phone ||
      !service ||
      !message
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    const quoteRequest = await createQuoteRequest({
      name,
      email,
      phone,
      company,
      service,
      shipping,
      shipment_size,
      message,
    });

    return res.status(201).json({
      message: "Quote request submitted successfully.",
      data: quoteRequest,
    });
  } catch (error) {
    console.error("Submit quote request error:", error);

    return res.status(500).json({
      message: "Failed to submit quote request.",
    });
  }
};
// =========================================
// GET ALL QUOTE REQUESTS
// =========================================

export const getQuoteRequests = async (
  req: Request,
  res: Response
) => {
  try {
    const quotes = await getAllQuoteRequests();

    res.status(200).json({
      success: true,
      quotes,
    });
  } catch (error) {
    console.error("Get quote requests error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch quote requests",
    });
  }
};