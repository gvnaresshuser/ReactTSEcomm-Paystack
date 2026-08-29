import { pool } from "../config/db.js";


export const findUserByEmail = async (
    email: string
) => {

    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            password_hash,
            role,
            created_at
        FROM users
        WHERE email = $1
        `,
        [email]
    );

    return result.rows[0];
};


export const createUser = async (
    name: string,
    email: string,
    passwordHash: string
) => {

    const result = await pool.query(
        `
        INSERT INTO users
            (
                name,
                email,
                password_hash
            )
        VALUES
            ($1, $2, $3)
        RETURNING
            id,
            name,
            email,
            role,
            created_at
        `,
        [
            name,
            email,
            passwordHash
        ]
    );

    return result.rows[0];
};

export const getUserById = async (userId: string) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            role,
            created_at
        FROM users
        WHERE id = $1
        `,
        [userId]
    );

    return result.rows[0];
};