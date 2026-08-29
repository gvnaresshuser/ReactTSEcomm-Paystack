import dotenv from "dotenv";

dotenv.config();


export const env = {

    port:
        Number(
            process.env.PORT || 5000
        ),

    nodeEnv:
        process.env.NODE_ENV ||
        "development",

    databaseUrl:
        process.env.DATABASE_URL ||
        "",

    frontendUrl:
        process.env.FRONTEND_URL ||
        "http://localhost:5173",

    jwtSecret:
        process.env.JWT_SECRET ||
        "",

    paystackKeyId:
        process.env.PAYSTACK_KEY_ID!,

    paystackKeySecret:
        process.env.PAYSTACK_SECRET_KEY!,

};