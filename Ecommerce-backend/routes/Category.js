// Import the Express framework
const express = require("express");

// Import the fetchCategory function from the Category controller
const { fetchCategory, createCategory } = require("../controller/Category");

// Initialize the Express router
const router = express.Router();

// categories is already added in base path
// Define a GET route for fetching category
router.get("/", fetchCategory).post("/", createCategory);

// Export the router module
exports.router = router;
