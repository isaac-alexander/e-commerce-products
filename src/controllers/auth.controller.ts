// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import pool from "../db"; // Database connection
import bcrypt from "bcryptjs"; // For hashing passwords
import jwt, { Secret, SignOptions } from "jsonwebtoken";

// ---------------------------
// JWT settings
// ---------------------------

// Secret key for signing JWTs. 
const JWT_SECRET: Secret = (process.env.JWT_SECRET as Secret) || "default_secret";
// How long the token will be valid (example: 1 hour)
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// ---------------------------
// Signup (Register a new user)
// ---------------------------
export async function signup(req: Request, res: Response) {
  try {
    // Get data sent by user
    const { username, email, password, role } = req.body;

    // Make sure all fields are filled
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a user with this email already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if ((existing.rowCount ?? 0) > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Encrypt/ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the new user to the database
    const result = await pool.query(
      `INSERT INTO users (username, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email, role`,
      [username, email, hashedPassword, role || "customer"] // default role = customer
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

    // Prepare JWT options (expiration time)
    const options: SignOptions = {
      expiresIn: (JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]) || "1h",
    };

    // Create payload (data inside the token)
    const payload = { id: user.id, role: user.role };

    // Sign the token (this will be sent to user to authenticate future requests)
    const token = jwt.sign(payload, JWT_SECRET, options);

    // Send back success message, token, and user info (without password)
    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
