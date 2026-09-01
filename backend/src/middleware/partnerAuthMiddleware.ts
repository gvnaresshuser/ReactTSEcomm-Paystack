import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AuthRequest } from "./authMiddleware.js";

export interface PartnerAuthRequest
  extends AuthRequest {
  partner?: {
    partnerId: string;
    role: string;
  };
}

export const partnerAuthMiddleware = (
  req: PartnerAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.partnerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Partner authentication required.",
      });
    }

    const decoded = jwt.verify(
      token,
      env.jwtSecret,
    ) as {
      partnerId: string;
      role: string;
    };

    if (
      decoded.role !==
      "delivery_partner"
    ) {
      return res.status(403).json({
        success: false,
        message: "Partner access denied.",
      });
    }

    req.partner = {
      partnerId: decoded.partnerId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error(
      "Partner authentication error:",
      error,
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired partner token.",
    });
  }
};