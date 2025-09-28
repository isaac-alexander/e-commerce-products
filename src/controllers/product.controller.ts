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

        // Build dynamic query
        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (value.name !== undefined) {
            fields.push(`name = $${idx++}`);
            values.push(value.name);
        }

        if (value.price !== undefined) {
            fields.push(`price = $${idx++}`);
            values.push(value.price);
        }

        if (value.description !== undefined) {
            fields.push(`description = $${idx++}`);
            values.push(value.description);
        }

        if (value.image !== undefined) {
            fields.push(`image = $${idx++}`);
            values.push(value.image);
        }

        if (value.category !== undefined) {
            fields.push(`category = $${idx++}`);
            values.push(value.category);
        }

        // Always update the timestamp
        fields.push(`updated_at = NOW()`);

        if (fields.length === 1) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        // Add id at the end
        values.push(id);

        const query = `
            UPDATE products 
            SET ${fields.join(", ")}
            WHERE id = $${idx}
            RETURNING *
        `;

        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

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
