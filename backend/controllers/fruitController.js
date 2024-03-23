const Fruit = require('../Models/fruitModel');

// Controller function to add a new fruit
exports.addFruit = async (req, res) => {
  try {
    const newFruit = new Fruit(req.body);
    // await newFruit.save();
    console.log(newFruit)
    res.status(201).json(newFruit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get all fruits
exports.getAllFruits = async (req, res) => {
  try {
    const fruits = await Fruit.find();
    res.json(fruits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get a specific fruit by ID
exports.getFruitById = async (req, res) => {
  try {
    const fruit = await Fruit.findById(req.params.id);
    if (!fruit) {
      return res.status(404).json({ message: 'Fruit not found' });
    }
    res.json(fruit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a fruit by ID
exports.updateFruitById = async (req, res) => {
  try {
    const fruit = await Fruit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fruit) {
      return res.status(404).json({ message: 'Fruit not found' });
    }
    res.json(fruit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a fruit by ID
exports.deleteFruitById = async (req, res) => {
  try {
    const fruit = await Fruit.findByIdAndDelete(req.params.id);
    if (!fruit) {
      return res.status(404).json({ message: 'Fruit not found' });
    }
    res.json({ message: 'Fruit deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
