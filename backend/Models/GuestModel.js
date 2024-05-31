const mongoose = require('mongoose')
const guestSchema = new mongoose.Schema({
    table: {type: Number, required: true},
    username: { type: String, required: true, unique: true },
  });
  
const Guest = mongoose.model("Guests", guestSchema);

module.exports = Guest