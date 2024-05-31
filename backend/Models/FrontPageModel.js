const mongoose = require('mongoose')
const frontPageSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true, max: 100},
    price: { type: Number, required: true },
    description: {type: String, required: true, max: 5000 },
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
  });
   const FrontPage = mongoose.model("Items", frontPageSchema);
  module.exports = FrontPage