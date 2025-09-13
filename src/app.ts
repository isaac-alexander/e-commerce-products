// handles the apllication setup files, express app, errorhandler, middlewares, routes and swagger
import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import productRoutes from "./routes/products.routes";

const app = express();
app.use(cors());
app.use(express.json());

// check route
app.get("/", (_req, res) => res.json({ status: "ok", service: "products-api" }));

// Product routes
app.use("/api/products", productRoutes);

// Swagger docs
const swaggerPath = path.join(process.cwd(), "swagger.json");
let swaggerDocument = {};
try {
    swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
} catch (e) {
    console.error("Could not read swagger.json:", e);
}
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Centralized error handler
app.use(errorHandler);

export default app;
