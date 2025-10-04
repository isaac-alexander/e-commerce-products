//Creates the users table if it doesn't exist
import pool from "../db";

// Function to create users table if it doesn't exist
const createUserTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

    try {
        await pool.query(query);
        console.log("Users table created (if not exists)");
    } catch (err) {
        console.error("Error creating users table:", err);
    }
};

export default createUserTable;
