import { Request, Response } from "express";
import pool from "../db";
import { signupSchema, loginSchema } from "../validation/user.schema";
