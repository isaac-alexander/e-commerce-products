// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import pool from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config";


// ---------------------------
// Signup (Register a new user)
// ---------------------------
export async function signup(req: Request, res: Response) {
    try {
        // Get data sent by user
        const { name, email, password, role } = req.body;

        // Make sure all fields are filled
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if a user with this email already exists
        const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if ((existing.rowCount ?? 0) > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Encrypt/ Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user to the database
        const result = await pool.query(
            `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
            [name, email, hashedPassword, role || "customer"] // default role = customer
        );

        // Return the saved user info (except password)
        return res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error("Signup error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}

// ---------------------------
// Login (Authenticate existing user)
// ---------------------------
export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Make sure user entered both email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find the user in the database by email
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rowCount === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];

        // Compare the password entered with the hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        //  JWT (expiration time)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Send back success message, token, and user info (without password)
        return res.json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, role: user.role },
        });
    } catch (err: any) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}
