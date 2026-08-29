import { pool } from "../config/db.js";


export const getOrCreateCart =
    async (
        userId: string
    ) => {

        const existingCart =
            await pool.query(

                `
                SELECT
                    id,
                    user_id,
                    created_at,
                    updated_at
                FROM carts
                WHERE user_id = $1
                `,

                [userId]

            );


        if (
            existingCart.rows.length > 0
        ) {

            return existingCart.rows[0];

        }


        const newCart =
            await pool.query(

                `
                INSERT INTO carts
                (
                    user_id
                )
                VALUES
                (
                    $1
                )
                RETURNING
                    id,
                    user_id,
                    created_at,
                    updated_at
                `,

                [userId]

            );


        return newCart.rows[0];

    };

    export const addToCart =
    async (
        userId: string,
        productId: string,
        quantity: number
    ) => {

        const cart =
            await getOrCreateCart(
                userId
            );


        const result =
            await pool.query(

                `
                INSERT INTO cart_items
                (
                    cart_id,
                    product_id,
                    quantity
                )
                VALUES
                (
                    $1,
                    $2,
                    $3
                )
                ON CONFLICT
                (
                    cart_id,
                    product_id
                )
                DO UPDATE SET
                    quantity =
                        cart_items.quantity
                        + EXCLUDED.quantity,

                    updated_at = NOW()

                RETURNING
                    id,
                    cart_id,
                    product_id,
                    quantity,
                    created_at,
                    updated_at
                `,

                [
                    cart.id,
                    productId,
                    quantity
                ]

            );


        return result.rows[0];

    };

    export const getCart =
    async (
        userId: string
    ) => {

        const cart =
            await getOrCreateCart(
                userId
            );


        const result =
            await pool.query(

                `
                SELECT
                    ci.id,
                    ci.product_id,
                    p.name,
                    p.description,
                    p.price,
                    p.image_url,
                    p.stock,
                    p.category,
                    ci.quantity,
                    (p.price * ci.quantity) AS subtotal
                FROM cart_items ci
                INNER JOIN products p
                    ON p.id = ci.product_id
                WHERE ci.cart_id = $1
                ORDER BY ci.created_at DESC
                `,

                [cart.id]

            );


        const items =
            result.rows;


        const total =
            items.reduce(

                (
                    sum,
                    item
                ) => {

                    return sum +
                        Number(
                            item.subtotal
                        );

                },

                0

            );


        return {

            id:
                cart.id,

            items,

            total

        };

    };

    export const updateCartItem =
    async (
        userId: string,
        productId: string,
        quantity: number
    ) => {

        const cart =
            await getOrCreateCart(
                userId
            );


        const result =
            await pool.query(

                `
                UPDATE cart_items
                SET
                    quantity = $1,
                    updated_at = NOW()
                WHERE
                    cart_id = $2
                    AND product_id = $3
                RETURNING
                    id,
                    cart_id,
                    product_id,
                    quantity,
                    created_at,
                    updated_at
                `,

                [
                    quantity,
                    cart.id,
                    productId
                ]

            );


        return result.rows[0];

    };

    export const getCartItem =
    async (
        userId: string,
        productId: string
    ) => {

        const cart =
            await getOrCreateCart(
                userId
            );


        const result =
            await pool.query(

                `
                SELECT
                    id,
                    cart_id,
                    product_id,
                    quantity
                FROM cart_items
                WHERE cart_id = $1
                AND product_id = $2
                `,

                [
                    cart.id,
                    productId
                ]

            );


        return result.rows[0];

    };


    export const removeCartItem =
    async (
        userId: string,
        productId: string
    ) => {

        const cart =
            await getOrCreateCart(
                userId
            );


        const result =
            await pool.query(

                `
                DELETE FROM cart_items
                WHERE
                    cart_id = $1
                    AND product_id = $2
                RETURNING
                    id,
                    cart_id,
                    product_id,
                    quantity
                `,

                [
                    cart.id,
                    productId
                ]

            );


        return result.rows[0];

    };