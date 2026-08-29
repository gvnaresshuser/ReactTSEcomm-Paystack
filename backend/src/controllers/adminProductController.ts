import { Request, Response } from "express";

import {
  getAllProductsAdmin,
  getProductByIdAdmin,
  createProductAdmin,
  updateProductAdmin,
  deleteProductAdmin,
} from "../models/adminProductModel.js";

export const getProductsAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getAllProductsAdmin();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Admin get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

export const getProductAdmin = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await getProductByIdAdmin(
      req.params.id as string
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Admin get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
    } = req.body;

    if (
      !name ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, price and stock are required",
      });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price and stock cannot be negative",
      });
    }

    const product = await createProductAdmin(
      name,
      description || "",
      Number(price),
      imageUrl || null,
      category || null,
      Number(stock)
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Admin create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, description, price, imageUrl, category, stock, isActive } =
      req.body;

    if (
      !name ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, price and stock are required",
      });
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Price and stock cannot be negative",
      });
    }

    const product = await updateProductAdmin(
      req.params.id as string,
      name,
      description || "",
      Number(price),
      imageUrl || null,
      category || null,
      Number(stock),
      isActive ?? true
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Admin update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
) => {
  try {
    const product = await deleteProductAdmin(
      req.params.id as string
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};