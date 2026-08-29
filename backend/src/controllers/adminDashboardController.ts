import { Request, Response } from "express";
import { getAdminDashboard } from "../models/adminDashboardModel.js";

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const dashboard = await getAdminDashboard();

    res.json({
      success: true,
      dashboard,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard",
    });
  }
};