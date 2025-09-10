// src/server.ts as the entry point to start the app.

import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler";
import productRoutes from "./routes/products.routes";
import createProductTable from "./data/createProductTable";

const app = express();

app.use(cors());
app.use(express.json());

// Middleware
app.use(errorHandler);

// Routes
app.use("/api", productRoutes);

createProductTable();

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
