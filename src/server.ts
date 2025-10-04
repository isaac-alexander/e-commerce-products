// src/server.ts only starts listening and runs DB setup (createProductTable()).
import dotenv from "dotenv";
import app from "./app";
import createProductTable from "./data/createProductTable";
import createUserTable from "./data/createUserTable";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Ensure products table exists before starting
createProductTable();
createUserTable()

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
