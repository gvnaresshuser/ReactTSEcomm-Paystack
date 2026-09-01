import { Response } from "express";
import bcrypt from "bcrypt";
import {
  getAllDeliveryPartners,
  getDeliveryPartnerById,
  createDeliveryPartner,
  updateDeliveryPartner,
  deleteDeliveryPartner,
} from "../models/deliveryPartnerModel.js";

import { AuthRequest } from "../middleware/authMiddleware.js";


const allowedStatuses = [
  "active",
  "inactive",
];


export const getAdminDeliveryPartners = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const deliveryPartners =
      await getAllDeliveryPartners();

    res.json({
      success: true,
      deliveryPartners,
    });
  } catch (error) {
    console.error(
      "Admin get delivery partners error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery partners",
    });
  }
};


export const getAdminDeliveryPartner = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const deliveryPartner =
      await getDeliveryPartnerById(
        req.params.id as string,
      );

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    res.json({
      success: true,
      deliveryPartner,
    });
  } catch (error) {
    console.error(
      "Admin get delivery partner error:",
      error,
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery partner",
    });
  }
};

export const createAdminDeliveryPartner = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const {
      full_name,
      phone,
      email,
      address,
      city,
      vehicle_type,
      vehicle_number,
      license_number,
      status,
      password,
    } = req.body;

    if (!full_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (!password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery partner status",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(
      password,
      10,
    );

    const deliveryPartner =
      await createDeliveryPartner({
        full_name: full_name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        address: address?.trim() || null,
        city: city?.trim() || null,
        vehicle_type:
          vehicle_type?.trim() || null,
        vehicle_number:
          vehicle_number?.trim() || null,
        license_number:
          license_number?.trim() || null,
        status: status || "active",
        password_hash: passwordHash,
      });

    res.status(201).json({
      success: true,
      message:
        "Delivery partner created successfully",
      deliveryPartner,
    });
  } catch (error: any) {
    console.error(
      "Admin create delivery partner error:",
      error,
    );

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message:
          "A delivery partner with this phone number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to create delivery partner",
    });
  }
};


export const updateAdminDeliveryPartner = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const {
      full_name,
      phone,
      email,
      address,
      city,
      vehicle_type,
      vehicle_number,
      license_number,
      status,
    } = req.body;

    if (!full_name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery partner status",
      });
    }

    const deliveryPartner =
      await updateDeliveryPartner(
        req.params.id as string,
        {
          full_name: full_name.trim(),
          phone: phone.trim(),
          email: email?.trim() || null,
          address: address?.trim() || null,
          city: city?.trim() || null,
          vehicle_type:
            vehicle_type?.trim() || null,
          vehicle_number:
            vehicle_number?.trim() || null,
          license_number:
            license_number?.trim() || null,
          status: status || "active",
        },
      );

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    res.json({
      success: true,
      message:
        "Delivery partner updated successfully",
      deliveryPartner,
    });
  } catch (error: any) {
    console.error(
      "Admin update delivery partner error:",
      error,
    );

    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message:
          "A delivery partner with this phone number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message:
        "Failed to update delivery partner",
    });
  }
};


export const deleteAdminDeliveryPartner = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const deliveryPartner =
      await deleteDeliveryPartner(
        req.params.id as string,
      );

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    res.json({
      success: true,
      message:
        "Delivery partner deleted successfully",
    });
  } catch (error) {
    console.error(
      "Admin delete delivery partner error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete delivery partner",
    });
  }
};