const mongoose = require("mongoose");
const completedItemSchema = new mongoose.Schema({
  current_user: { type: String, require: true },
  id: {type: Number},
  name: { type: String },
  category: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  image: { type: String }, // Adding the image field
  completed: {type: Boolean, default: false}
},
{timestamps: true}
);
const CompletedOrderModel = mongoose.model(
  "CompletedItem",
  completedItemSchema
);
module.exports = CompletedOrderModel;
