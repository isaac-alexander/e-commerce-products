// src/server.ts
import express from "express";
import bodyParser from "body-parser";
import productRoutes from "./routes/products.routes";

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api", productRoutes);

// Server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
