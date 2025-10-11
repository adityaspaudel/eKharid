const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  role: { type: String, enum: ["buyer", "seller"], default: "buyer" }, // Example roles
});

const User = mongoose.model("User", userSchema);

module.exports = User;
