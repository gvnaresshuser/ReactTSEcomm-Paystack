import app from "./app.js";
/* import { env } from "./config/env";
import { pool } from "./config/db"; */
import { env } from "./config/env.js";
import { pool } from "./config/db.js";

/* import { env } from "./config/env.ts";
import { pool } from "./config/db.ts"; */

const startServer = async () => {

    try {

        const result =
            await pool.query(
                "SELECT NOW()"
            );

        console.log(
            "PostgreSQL connected successfully"
        );

        console.log(
            "Database time:",
            result.rows[0].now
        );

        app.listen(
            env.port,
            () => {

                console.log(
                    `Server running on port ${env.port}`
                );

                console.log(
                    `http://localhost:${env.port}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Database connection failed:",
            error
        );

        process.exit(1);
    }
};


startServer();