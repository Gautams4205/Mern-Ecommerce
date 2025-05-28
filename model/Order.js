// Importing required modules
const mongoose = require("mongoose"); // Mongoose for MongoDB interaction
const { Schema } = mongoose; // Extracting Schema from mongoose
const uniqueValidator = require("mongoose-unique-validator"); // Plugin for validating unique fields

// Defining the schema for the order model
const orderSchema = new Schema({
  items: { type: [Schema.Types.Mixed], required: true },
  totalitems: { type: Number },
  subtotal: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  PaymentMethod: { type: String, required: true },
  SelectedAddress: { type: Schema.Types.Mixed, required: true },
  status: { type: String, default: "pending" },
});

// Adding a plugin to enforce unique validation on fields
orderSchema.plugin(uniqueValidator);

// Exporting the order model
exports.Order = mongoose.model("Order", orderSchema);

// Defining a virtual field 'id' to replace '_id' in JSON responses
const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id.toString(); // Map '_id' to 'id'
});

// Setting options for the JSON transformation of the schema
orderSchema.set("toJSON", {
  virtuals: true, // Include virtual fields in JSON output
  versionKey: false, // Exclude '__v' field from JSON output
  transform: function (doc, ret) {
    ret.id = ret._id.toString(); // Ensure 'id' is included
    delete ret._id; // Remove '_id' field from JSON output
  },
});
// orderSchema.virtual("id").get(function () {
//   return this._id.toString(); // Ensure 'id' is a string version of '_id'
// });

// // Setting options for JSON transformation
// orderSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     ret.id = ret._id.toString(); // Ensure 'id' is included
//     delete ret._id; // Remove '_id' field from JSON output
//   },
// });
