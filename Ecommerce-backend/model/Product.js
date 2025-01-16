// Importing required modules
const mongoose = require("mongoose"); // Mongoose for MongoDB interaction
const { Schema } = mongoose; // Extracting Schema from mongoose
const uniqueValidator = require("mongoose-unique-validator"); // Plugin for validating unique fields

// Defining the schema for the Product model
const productSchema = new Schema({
  title: { type: String, unique: true, required: true }, // Unique and required product title
  description: { type: String, required: true }, // Required product description
  price: {
    type: Number,
    min: [0, "wrong min price"], // Minimum price validation
    required: true, // Required field
  },
  discountPercentage: {
    type: Number,
    min: [0, "wrong min discount"], // Minimum discount validation
    max: [99, "wrong max discount"], // Maximum discount validation
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"], // Minimum rating validation
    max: [5, "wrong max rating"], // Maximum rating validation
    default: 0, // Default rating value
  },
  stock: {
    type: Number,
    min: [0, "wrong min stock"], // Minimum stock validation
    default: 0, // Default stock value
  },
  brand: { type: String, required: true }, // Required product brand
  category: { type: String, required: true }, // Required product category
  thumbnail: { type: String, required: true }, // Required product thumbnail URL
  images: { type: [String], required: true }, // Required array of image URLs
  deleted: { type: Boolean, default: false }, // Soft delete flag with default as false
});

// Adding a plugin to enforce unique validation on fields
productSchema.plugin(uniqueValidator);

// Exporting the Product model
exports.Product = mongoose.model("Product", productSchema);

// Defining a virtual field 'id' to replace '_id' in JSON responses
const virtual = productSchema.virtual("id");
virtual.get(function () {
  return this._id; // Map '_id' to 'id'
});

// Setting options for the JSON transformation of the schema
productSchema.set("toJSON", {
  virtuals: true, // Include virtual fields in JSON output
  versionKey: false, // Exclude '__v' field from JSON output
  transform: function (doc, ret) {
    delete ret._id; // Remove '_id' field from JSON output
  },
});
