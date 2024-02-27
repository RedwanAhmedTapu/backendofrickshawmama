// register.model.js
const mongoose = require("mongoose");

// Define User Schema
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
   
  },
  lname: {
    type: String,
   
  },
  email: {
    type: String,
    required: true,
   
  },
  password: {
    type: String,
   
  },
});

// Define Verification Schema
const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
   
  },
  code: {
    type: String,
    required: true,
  },
});

// Create models
const User = mongoose.model("User", userSchema);
const Verification = mongoose.model("Verification", verificationSchema);

module.exports = {
  User,
  Verification,
};
