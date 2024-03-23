const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    required: true
  },
  stars: {
    type: Array,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  originalPrice: {
    type: String,
    required: true
  }
});


const Fruit = mongoose.model('fruits', fruitSchema);

module.exports = Fruit;