const mongoose = require('mongoose')
const favoriteItemSchema = new mongoose.Schema({
    current_user: {type: String, require: true},
    name: { type: String },
    category: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 },
    imageUrl: { type: String }, // Adding the image field
  });
  const FavoriteItem = mongoose.model("FavoriteItems", favoriteItemSchema);
 module.exports = FavoriteItem 