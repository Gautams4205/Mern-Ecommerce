// Importing required modules
const mongoose = require("mongoose"); // Mongoose for MongoDB interaction
const { Schema } = mongoose; // Extracting Schema from mongoose

// Defining the schema for the Cart model
const cartSchema = new Schema({
  quantity: { type: Number, required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Exporting the cart model
exports.Cart = mongoose.model("Cart", cartSchema);

// Defining a virtual field 'id' to replace '_id' in JSON responses
const virtual = cartSchema.virtual("id");
virtual.get(function () {
  return this._id; // Map '_id' to 'id'
});

// Setting options for the JSON transformation of the schema
cartSchema.set("toJSON", {
  virtuals: true, // Include virtual fields in JSON output
  versionKey: false, // Exclude '__v' field from JSON output
  transform: function (doc, ret) {
    delete ret._id; // Remove '_id' field from JSON output
  },
});
