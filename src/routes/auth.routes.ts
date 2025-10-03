// src/routes/auth.routes.ts
import { Router } from "express";
import { signup, login } from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup); // Register new user
router.post("/login", login);   // Login existing user

export default router;
