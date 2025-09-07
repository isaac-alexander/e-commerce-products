import { Request, Response } from "express";
import pool from "../db";
import { createProductSchema, updateProductSchema } from '../validation/product.schema';


// Create a new product
export async function createProduct(req: Request, res: Response) {
    try {
        // Validate request body
        const { error, value } = createProductSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        const { name, price, description, image, category } = value;

        // Insert into database
        const result = await pool.query(
            `INSERT INTO products (name, price, description, image, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [name, price, description || null, image || null, category]
        );

        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Get all products
export async function getAllProducts(_req: Request, res: Response) {
    try {
        const result = await pool.query("SELECT * FROM products ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Get a single product by ID
export async function getProductById(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: "Product not found" });

        res.json(result.rows[0]);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Update a product
export async function updateProduct(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        // Validate request body
        const { error, value } = updateProductSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.message });

        // Update query
        const result = await pool.query(
            `UPDATE products 
       SET name = $1, price = $2, description = $3, image = $4, category = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
            [
                value.name || null,
                value.price || null,
                value.description || null,
                value.image || null,
                value.category || null,
                id,
            ]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: "Product not found" });

        res.json(result.rows[0]);
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

// Delete a product
export async function deleteProduct(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });

        const result = await pool.query("DELETE FROM products WHERE id = $1 RETURNING id", [id]);
        if (result.rowCount === 0) return res.status(404).json({ message: "Product not found" });

        res.json({ message: "Product deleted" });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
