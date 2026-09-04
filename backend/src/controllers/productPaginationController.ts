import { Request, Response } from "express";

import {
  getProductsPaginated,
} from "../models/productPaginationModel.js";

export const getProductsWithPagination = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const search =
      typeof req.query.search === "string"
        ? req.query.search
        : "";

    const category =
      typeof req.query.category === "string"
        ? req.query.category
        : "All";

    const result = await getProductsPaginated({
      page,
      limit,
      search,
      category,
    });

    const totalPages = Math.ceil(
      result.totalProducts / limit,
    );

    res.status(200).json({
      products: result.products,

      pagination: {
        page,
        limit,
        totalProducts: result.totalProducts,
        totalPages,
      },
    });
  } catch (error) {
    console.error(
      "Product pagination error:",
      error,
    );

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};