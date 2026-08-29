import { pool } from "../config/db.js";


export const getAllProductsAdmin = async () => {

    const result = await pool.query(
        `
        SELECT
            id,
            name,
            description,
            price,
            image_url,
            category,
            stock,
            is_active,
            created_at,
            updated_at
        FROM products
        ORDER BY created_at DESC
        `
    );

    return result.rows;
};


export const getProductByIdAdmin = async (
    productId: string
) => {

    const result = await pool.query(
        `
        SELECT
            id,
            name,
            description,
            price,
            image_url,
            category,
            stock,
            is_active,
            created_at,
            updated_at
        FROM products
        WHERE id = $1
        `,
        [productId]
    );

    return result.rows[0] || null;
};


export const createProductAdmin = async (
    name: string,
    description: string,
    price: number,
    imageUrl: string | null,
    category: string | null,
    stock: number
) => {

    const result = await pool.query(
        `
        INSERT INTO products (
            name,
            description,
            price,
            image_url,
            category,
            stock,
            is_active
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            TRUE
        )
        RETURNING
            id,
            name,
            description,
            price,
            image_url,
            category,
            stock,
            is_active,
            created_at,
            updated_at
        `,
        [
            name,
            description,
            price,
            imageUrl,
            category,
            stock
        ]
    );

    return result.rows[0];
};


export const updateProductAdmin = async (
    productId: string,
    name: string,
    description: string,
    price: number,
    imageUrl: string | null,
    category: string | null,
    stock: number,
    isActive: boolean
) => {

    const result = await pool.query(
        `
        UPDATE products
        SET
            name = $1,
            description = $2,
            price = $3,
            image_url = $4,
            category = $5,
            stock = $6,
            is_active = $7,
            updated_at = NOW()
        WHERE id = $8
        RETURNING
            id,
            name,
            description,
            price,
            image_url,
            category,
            stock,
            is_active,
            created_at,
            updated_at
        `,
        [
            name,
            description,
            price,
            imageUrl,
            category,
            stock,
            isActive,
            productId
        ]
    );

    return result.rows[0] || null;
};


export const deleteProductAdmin = async (
    productId: string
) => {

    const result = await pool.query(
        `
        UPDATE products
        SET
            is_active = FALSE,
            updated_at = NOW()
        WHERE id = $1
        RETURNING
            id,
            name,
            is_active,
            updated_at
        `,
        [productId]
    );

    return result.rows[0] || null;
};