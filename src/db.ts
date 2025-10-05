import dotenv from "dotenv";
import { Pool } from "pg";
import { DB_USER, DB_HOST, DB_DATABASE, DB_PASSWORD, DB_PORT } from "./config";

dotenv.config();

// PostgreSQL connection
const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_DATABASE,
    password: DB_PASSWORD,
    port: DB_PORT,
});

// Test connection + ensure users table exists
pool.connect()
    .then(async (client) => {
        console.log("Connected to PostgreSQL!");

        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(20) DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        client.release();
    })
    .catch((err) => {
        console.error(" Connection error:", err);
    });

export default pool;
