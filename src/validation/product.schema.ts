//Joi schemas for product validation
import Joi from "joi";

// Schema for creating a new product
export const createProductSchema = Joi.object({
    name: Joi.string().required(),      // must be a string, cannot be empty
    price: Joi.number().required(),     // must be a number
    description: Joi.string().allow(""), // optional (can be empty string)
    image: Joi.string().allow(""),      // optional (can be empty string)
    category: Joi.string().required(),  // must be a string, cannot be empty
});

// Schema for updating a product
export const updateProductSchema = Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    description: Joi.string().allow(""),
    image: Joi.string().allow(""),
    category: Joi.string(),
});
