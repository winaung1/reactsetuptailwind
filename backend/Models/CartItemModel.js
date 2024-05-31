const mongoose = require('mongoose')
const cartItemSchema = new mongoose.Schema({
    current_user: {type: String, require: true},
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
    image: { type: String }, // Adding the image field
  });
  
  const CartItem = mongoose.model("CartItem", cartItemSchema);
 module.exports = CartItem 