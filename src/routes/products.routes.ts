import { Router } from "express";
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/product.controller";
import { authenticate, isAdmin  } from "../middleware/auth.middleware";

const router = Router();

// Customers and Admin
router.get("/", authenticate, getAllProducts);
router.get("/:id", authenticate, getProductById);

// Admins
router.post("/products", authenticate, isAdmin , createProduct);
router.put("/:id", authenticate, isAdmin , updateProduct);
router.delete("/:id", authenticate, isAdmin , deleteProduct);

export default router;
