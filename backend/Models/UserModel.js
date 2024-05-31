const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    role: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    logged: {type: Boolean, default: false }
  });
  
const User = mongoose.model("User", userSchema);

module.exports = User