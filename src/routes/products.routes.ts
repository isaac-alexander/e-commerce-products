import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";

const router = Router();

// Customers and Admin
router.get("/products", authenticate, getAllProducts);
router.get("/products/:id", authenticate, getProductById);

// Admins
router.post("/products", authenticate, authorizeAdmin, createProduct);
router.put("/products/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/products/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
