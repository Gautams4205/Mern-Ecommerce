// Importing required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Importing route files for different entities
const productRouter = require("./routes/Product");
const brandRouter = require("./routes/Brand");
const categoryRouter = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");

// Creating an Express server instance
const server = express();

// Function to establish a connection to the MongoDB database
async function main() {
  await mongoose.connect("mongodb://localhost:27017/Ecommerce"); // Connect to the Ecommerce database
  console.log("Database connected Successfully"); // Log successful connection
}

// Middleware to parse JSON in incoming request bodies
server.use(express.json());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

server.use(cors({ exposedHeaders: ["X-Total-Count"] }));
// Setting up routes with base paths for different entities
server.use("/products", productRouter.router); // Routes for product-related operations
server.use("/brands", brandRouter.router); // Routes for brand-related operations
server.use("/categories", categoryRouter.router); // Routes for category-related operations
server.use("/users", userRouter.router); // Routes for user-related operations
server.use("/auth", authRouter.router); // Routes for auth-related operations
server.use("/cart", cartRouter.router); // Routes for cart-related operations

// Call the main function to establish a database connection
// Catch and log any errors during the connection process
main().catch((error) => {
  console.log(error);
});

// Default route to confirm the server is running
server.get("/", (req, res) => {
  res.json({ status: "Success" }); // Respond with a JSON object
});

// Start the server and listen on port 8080
server.listen(8080, () => {
  console.log("Server is running Successfully"); // Log successful server start
});
