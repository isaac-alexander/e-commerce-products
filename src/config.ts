import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";

// Load .env file
dotenv.config();

// Server Configuration
export const PORT = Number(process.env.PORT) || 3000;

// Database Configuration
export const DB_USER = process.env.DB_USER || "postgres";
export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_DATABASE = process.env.DB_DATABASE || "e_commerce_product";
export const DB_PASSWORD = process.env.DB_PASSWORD || "";
export const DB_PORT = Number(process.env.DB_PORT) || 5432;

// JWT Configuration
// process.env returns a string | undefined, but jwt.sign expects SignOptions["expiresIn"]
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
export const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "1h";
