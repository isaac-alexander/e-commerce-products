import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";

const router = Router();

// Customers and Admin
router.get("/", authenticate, getAllProducts);
router.get("/:id", authenticate, getProductById);

// Admins
router.post("/products", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
