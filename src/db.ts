import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

// PostgreSQL connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});

// Test connection + ensure users table exists
pool.connect()
    .then(async (client) => {
        console.log("✅ Connected to PostgreSQL!");

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
