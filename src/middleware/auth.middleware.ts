import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define what we expect in the JWT
interface TokenData {
  id: number;
  role: "admin" | "customer";
}

// Middleware to check if user provides a valid token
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenData;

    (req as any).user = decoded; // store user info in request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Middleware to allow only Admins
export function authorizeAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as TokenData;
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}
