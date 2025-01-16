// Importing required modules
const mongoose = require("mongoose"); // Mongoose for MongoDB interaction
const { Schema } = mongoose; // Extracting Schema from mongoose
const uniqueValidator = require("mongoose-unique-validator"); // Plugin for validating unique fields

// Defining the schema for the User model
const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  addresses: { type: [Schema.Types.Mixed] },
  name: { type: String },
  orders: { type: [Schema.Types.Mixed] },
});

// Adding a plugin to enforce unique validation on fields
userSchema.plugin(uniqueValidator);

// Exporting the User model
exports.User = mongoose.model("User", userSchema);

// Defining a virtual field 'id' to replace '_id' in JSON responses
const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id; // Map '_id' to 'id'
});

// Setting options for the JSON transformation of the schema
userSchema.set("toJSON", {
  virtuals: true, // Include virtual fields in JSON output
  versionKey: false, // Exclude '__v' field from JSON output
  transform: function (doc, ret) {
    delete ret._id; // Remove '_id' field from JSON output
  },
});
