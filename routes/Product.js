// Importing the Express library
const express = require("express");

// Importing controller functions for creating and fetching products
const { createProduct, fetchAllProducts, fetchProductById, updateProduct } = require("../controller/Product");

// Creating a new Express Router instance
const router = express.Router();

// Define routes for product-related operations
// POST request to "/" will invoke the createProduct function
// GET request to "/" will invoke the fetchAllProducts function

router.post("/", createProduct).get("/", fetchAllProducts).get("/:id", fetchProductById).patch("/:id", updateProduct);

// Exporting the router for use in other parts of the application
exports.router = router;
