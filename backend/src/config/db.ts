import { Pool } from "pg";

/* import { env } from "./env"; */
import { env } from "./env.js";

export const pool = new Pool({

    connectionString:
        env.databaseUrl,

    max: 10,

    idleTimeoutMillis: 30000,

    connectionTimeoutMillis: 10000,

    ssl: {
        rejectUnauthorized: false
    }

});