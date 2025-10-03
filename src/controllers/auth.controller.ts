// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import pool from "../db";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Signup (Register)
export async function signup(req: Request, res: Response) {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if email already exists
        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if ((existing.rowCount ?? 0) > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user (default role = customer if not provided)
        const result = await pool.query(
            `INSERT INTO users (username, email, password, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, username, email, role`,
            [username, email, hashedPassword, role || "customer"]
        );

        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Login
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Check user
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rowCount === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create JWT
        const payload = { id: user.id, role: user.role };
        const options: SignOptions = {
            expiresIn: Number(process.env.JWT_EXPIRES_IN) || 3600,
        };


        const token = jwt.sign(payload, JWT_SECRET, options);

        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
