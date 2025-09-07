import { Request, Response, NextFunction } from "express";

// Centralized error handling
const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error("Error stack:", err.stack);

    res.status(500).json({
        status: 500,
        message: "Something went wrong",
        error: err.message || "Unknown error",
    });
};

export default errorHandler;
