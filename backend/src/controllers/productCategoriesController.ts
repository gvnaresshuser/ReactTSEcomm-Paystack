import { Request, Response } from "express";

import {
  getProductCategories,
} from "../models/productCategoriesModel.js";

export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const categories =
      await getProductCategories();

    res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error(
      "Get product categories error:",
      error,
    );

    res.status(500).json({
      message: "Failed to fetch product categories",
    });
  }
};