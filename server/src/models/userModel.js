const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },

  password: { type: String, required: true, trim: true },
  confirmPassword: { type: String, trim: true },

  role: { type: String, enum: ["buyer", "seller"], default: "buyer" }, // Example roles
});

const User = mongoose.model("User", userSchema);

module.exports = User;
