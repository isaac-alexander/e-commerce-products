# E-Commerce Products API

A simple CRUD (Create, Read, Update, Delete) REST API built with **Node.js + nodemon + TypeScript + Express + joi + PostgreSQL**.  
This project manages products for an online store.

---

##  Features
- Create a new product
- Get all products
- Get a single product by ID
- Update a product
- Delete a product

Each product has:
- `id`
- `name`
- `price`
- `description`
- `image`
- `category`
- `created_at`

---


### Clone the repo
```bash
git clone https://github.com/your-username/ecommerce-products-api.git
cd ecommerce-products-api

Install dependencies

npm install

Setup environment variables
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=e_commerce_product
DB_PORT=5432
DB_PASSWORD=yourpassword

Create the database
Run the server - npm run dev

API Endpoints

URL: http://localhost:3000/api/products

Create a Product

POST /api/products

header - Content-Type: application/json
body - JSON
{
  "name": "Laptop",
  "price": 1200.50,
  "description": "A powerful laptop",
  "image": "https://example.com/laptop.jpg",
  "category": "Electronics"
}

Get All Products

GET /api/products

Get One Product

GET /api/products/:id

Update a Product

PUT /api/products/:id

{
  "price": 999.99,
  "description": "Discounted high-performance laptop"
}

Delete a Product

DELETE /api/products/:id
 ```
#### Testing with Swagger
Start your server with:
  npm run dev

Open Swagger UI in your browser:
  http://localhost:3000/docs

You’ll see a list of all API endpoints:

POST /api/products - to create a product

GET /api/products - to get all products

GET /api/products/{id} - get one product

PUT /api/products/{id} - update product

DELETE /api/products/{id} - delete product

Click on any endpoint - Try it out - fill in the request body - click Execute.
You’ll see both the request sent and the server response below it.