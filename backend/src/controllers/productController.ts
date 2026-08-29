import {
    Request,
    Response
} from "express";

import {
    getAllProducts,
    getProductById,
    createProduct as createProductModel,
    updateProduct as updateProductModel,
    deleteProduct as deleteProductModel
} from "../models/productModel.js";


export const getProducts =
    async (
        req: Request,
        res: Response
    ) => {
        try {
            const search =
                req.query.search as string | undefined;
            const products =
                await getAllProducts(
                    search
                );
            return res.status(200).json({
                success: true,
                products
            });
        } catch (error) {
            console.error(
                "Get products error:",
                error
            );
            return res.status(500).json({
                success: false,
                message:
                   "Failed to fetch products"
            });
        }
    };
    //-----------------------
    export const getProduct =
    async (
        req: Request,
        res: Response
    ) => {

        try {
            const id = req.params.id as string;
            const product =
               await getProductById(id);

           if (!product) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Product not found"
                });
            }

            return res.status(200).json({
                success: true,
                product
            });
        } catch (error) {
            console.error(
               "Get product error:",
               error
           );

           return res.status(500).json({
                success: false,
                message:
                   "Failed to fetch product"
            });
        }
    };

    export const createProduct =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const {
                name,
                description,
                price,
                imageUrl,
                stock,
                category
            } = req.body;


            // Basic validation

            if (
                !name ||
                price === undefined ||
                stock === undefined ||
                !category
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name, price, stock and category are required"

                });

            }


            const product =
                await createProductModel(

                    name,
                    description || "",
                    Number(price),
                    imageUrl || "",
                    Number(stock),
                    category

                );


            return res.status(201).json({

                success: true,

                message:
                    "Product created successfully",

                product

            });

        } catch (error) {

            console.error(
                "Create product error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to create product"

            });

        }

    };

    export const updateProduct =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const id =
                req.params.id as string;


            const {
                name,
                description,
                price,
                imageUrl,
                stock,
                category
            } = req.body;


            // Basic validation

            if (
                !name ||
                price === undefined ||
                stock === undefined ||
                !category
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Name, price, stock and category are required"

                });

            }


            const product =
                await updateProductModel(

                    id,

                    name,

                    description || "",

                    Number(price),

                    imageUrl || "",

                    Number(stock),

                    category

                );


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Product updated successfully",

                product

            });

        } catch (error) {

            console.error(
                "Update product error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to update product"

            });

        }

    };

    export const deleteProduct =
    async (
        req: Request,
        res: Response
    ) => {

        try {

            const id =
                req.params.id as string;


            const product =
                await deleteProductModel(id);


            if (!product) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Product not found"

                });

            }


            return res.status(200).json({

                success: true,

                message:
                    "Product deleted successfully",

                product

            });

        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Failed to delete product"

            });

        }

    };