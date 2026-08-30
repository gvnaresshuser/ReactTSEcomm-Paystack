import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    findUserByEmail,
    createUser,
    getUserById
} from "../models/userModel.js";

import { env } from "../config/env.js";
import { AuthRequest } from "../middleware/authMiddleware.js";

export const register = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            name,
            email,
            password
        } = req.body;
        // Validate input
        if (
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Name, email and password are required"
            });
        }
        // Check existing user
        const existingUser =
            await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                   "Email already registered"
            });
        }
        // Hash password
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );
        // Create user
        const user =
            await createUser(
                name,
                email,
                hashedPassword
            );
        return res.status(201).json({
            success: true,
            message:
                "User registered successfully",
            user
        });
    } catch (error) {
        console.error(
            "Register error:",
            error
        );
        return res.status(500).json({
            success: false,
            message:
               "Internal server error"
        });
    }
};

// LOGIN
export const login = async (
    req: Request,
    res: Response
) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Validate input

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required"

            });

        }


        // Find user

        const user =
            await findUserByEmail(email);


        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // Compare password

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password_hash
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password"

            });

        }


        // Create JWT

        const token =
            jwt.sign(

                {
                    userId: user.id,
                    role: user.role
                },

                env.jwtSecret,

                {
                    expiresIn: "1d"
                }

            );


        // Store JWT in cookie

       /*  res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure:
                    env.nodeEnv ===
                    "production",
                sameSite:
                    env.nodeEnv ===
                    "production"
                        ? "none"
                        : "lax",
                maxAge:
                    24 * 60 * 60 * 1000,
                path: "/"
            }
        ); */
        //------------------- changed for iphone support --------------------------
        res.cookie(
    "token",
    token,
    {
        httpOnly: true,
        secure: env.nodeEnv === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/"
    }
);
        //------------------- changed for iphone support --------------------------


        return res.status(200).json({
            success: true,
            message:
                "Login successful",
                //token, // 👈 DEMO ONLY
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );
        return res.status(500).json({
            success: false,
            message:
                "Internal server error"
        });
    }
};
//--------------------------
export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await getUserById(userId);
        console.log(user);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const user = await getUserById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error("Get current user error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch current user"
        });
    }
};


export const logout = async (
    req: Request,
    res: Response
) => {
    try {
        /* res.clearCookie("token", {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: env.nodeEnv === "production" ? "none" : "lax",
            path: "/"
        }); */
        //---------------- changed for iphone support --------------------------
        res.clearCookie("token", {
            httpOnly: true,
            secure: env.nodeEnv === "production",
            sameSite: "lax",
            path: "/"
        });
        //---------------- changed for iphone support --------------------------

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "Logout failed"
        });
    }
};