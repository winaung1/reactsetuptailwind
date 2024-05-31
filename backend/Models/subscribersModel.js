const mongoose = require('mongoose')
const subSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
const Sub = mongoose.model("Subs", subSchema);

module.exports = Sub