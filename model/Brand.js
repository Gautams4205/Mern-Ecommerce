// Importing required modules
const mongoose = require("mongoose"); // Mongoose for MongoDB interaction
const { Schema } = mongoose; // Extracting Schema from mongoose
const uniqueValidator = require("mongoose-unique-validator"); // Plugin to validate unique fields

// Defining the schema for the Brand model
const brandSchema = new Schema({
  value: {
    type: String,
    unique: true, // Ensure the 'value' field is unique
    required: true, // Mark as a required field
  },
  label: {
    type: String,
    unique: true, // Ensure the 'label' field is unique
    required: true, // Mark as a required field
  },
  checked: {
    type: Boolean,
    default: false, // Default value is 'false'
  },
});

// Adding a plugin to enforce unique validation on fields
brandSchema.plugin(uniqueValidator);

// Exporting the Brand model
exports.Brand = mongoose.model("Brand", brandSchema);

// Defining a virtual field 'id' to replace '_id' in JSON responses
const virtual = brandSchema.virtual("id");
virtual.get(function () {
  return this._id; // Map '_id' to 'id'
});

// Setting options for the JSON transformation of the schema
brandSchema.set("toJSON", {
  virtuals: true, // Include virtual fields in JSON output
  versionKey: false, // Exclude '__v' field from JSON output
  transform: function (doc, ret) {
    delete ret._id; // Remove '_id' field from JSON output
  },
});
