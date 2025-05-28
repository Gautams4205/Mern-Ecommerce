// Import the Express framework
const express = require("express");

// Import the fetchBrands function from the Brand controller
const { fetchBrands, createBrands } = require("../controller/Brand");

// Initialize the Express router
const router = express.Router();

// brands is already added in base path
// Define a GET route for fetching brands
router.get("/", fetchBrands).post("/", createBrands);

// Export the router module
exports.router = router;
