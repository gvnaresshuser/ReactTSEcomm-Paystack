import { pool } from "../config/db.js";


export const getAllProducts =
    async (
        search?: string
    ) => {

        let query = `
            SELECT
                id,
                name,
                description,
                price,
                image_url,
                stock,
                category,
                created_at,
                updated_at
            FROM products
        `;

        const values: string[] = [];


        if (search) {

            query += `
                WHERE
                    name ILIKE $1
                    OR description ILIKE $1
                    OR category ILIKE $1
            `;

            values.push(
                `%${search}%`
            );

        }


        query += `
            ORDER BY created_at DESC
        `;


        const result =
            await pool.query(
                query,
                values
            );


        return result.rows;
    };
    //---------------------------
   export const getProductById =
    async (
        id: string
    ) => {

        const result =
            await pool.query(

                `
                SELECT
                    id,
                    name,
                    description,
                    price,
                    image_url,
                    stock,
                    category,
                    created_at,
                    updated_at
                FROM products
                WHERE id = $1
                `,

                [id]

            );


        return result.rows[0];
    };
    //--------------------------------
export const createProduct =
    async (
        name: string,
        description: string,
        price: number,
        imageUrl: string,
        stock: number,
        category: string
    ) => {

        const result =
            await pool.query(

                `
                INSERT INTO products
                (
                    name,
                    description,
                    price,
                    image_url,
                    stock,
                    category
                )
                VALUES
                (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6
                )
                RETURNING
                    id,
                    name,
                    description,
                    price,
                    image_url,
                    stock,
                    category,
                    created_at,
                    updated_at
                `,

                [
                    name,
                    description,
                    price,
                    imageUrl,
                    stock,
                    category
                ]

            );


        return result.rows[0];
    };

    export const updateProduct =
    async (
        id: string,
        name: string,
        description: string,
        price: number,
        imageUrl: string,
        stock: number,
        category: string
    ) => {

        const result =
            await pool.query(

                `
                UPDATE products
                SET
                    name = $1,
                    description = $2,
                    price = $3,
                    image_url = $4,
                    stock = $5,
                    category = $6,
                    updated_at = NOW()
                WHERE id = $7
                RETURNING
                    id,
                    name,
                    description,
                    price,
                    image_url,
                    stock,
                    category,
                    created_at,
                    updated_at
                `,

                [
                    name,
                    description,
                    price,
                    imageUrl,
                    stock,
                    category,
                    id
                ]

            );


        return result.rows[0];
    };

export const deleteProduct =
    async (
        id: string
    ) => {

        const result =
            await pool.query(

                `
                DELETE FROM products
                WHERE id = $1
                RETURNING
                    id,
                    name,
                    description,
                    price,
                    image_url,
                    stock,
                    category
                `,

                [id]

            );


        return result.rows[0];
    };











/*
Why ILIKE?
PostgreSQL's:
ILIKE
performs a case-insensitive search.
So:
iphone
can find:
iPhone 15
And:
MOBILE
can find:
Mobiles
*/