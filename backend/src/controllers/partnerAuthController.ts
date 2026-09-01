import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import { getPartnerByPhone } from "../models/partnerAuthModel.js";

export const partnerLogin = async (
  req: Request,
  res: Response,
) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Phone and password are required.",
      });
    }

    const partner =
      await getPartnerByPhone(phone);

    if (!partner) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password.",
      });
    }

    if (partner.status !== "active") {
      return res.status(403).json({
        success: false,
        message:
          "Your delivery partner account is inactive.",
      });
    }

    if (!partner.password_hash) {
      return res.status(403).json({
        success: false,
        message:
          "Password has not been configured for this account.",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        partner.password_hash,
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid phone number or password.",
      });
    }

      const token = jwt.sign(
      {
        partnerId: partner.id,
        role: "delivery_partner",
      },
      env.jwtSecret,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("partnerToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Partner login successful.",
      //token,//no need to return this
      partner: {
        id: partner.id,
        full_name: partner.full_name,
        phone: partner.phone,
        email: partner.email,
        city: partner.city,
        vehicle_type: partner.vehicle_type,
        vehicle_number: partner.vehicle_number,
        status: partner.status,
      },
    });
  } catch (error) {
    console.error(
      "Partner login error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Partner login failed.",
    });
  }
};