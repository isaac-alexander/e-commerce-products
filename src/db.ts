import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

// Test connection
pool.connect()
    .then(() => {
        console.log(" Connected to PostgreSQL!");
    })
    .catch((err) => {
        console.error(" Connection error:", err);
    });

export default pool;
