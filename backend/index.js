const cors = require('cors')
const express = require('express')
const app = express()
const port = 3001
const mongoose = require('mongoose');
const fruitRoutes = require('./Routes/fruitRoutes');
const Fruit = require('./Models/fruitModel')
app.use(cors())
app.use(express.json())


mongoose.connect('mongodb+srv://winentertainment99:Test123@cluster0.1vdjljd.mongodb.net/cartdb').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// app.use('/', fruitRoutes)
app.get('/getAllFruits', async (req, res) => {
    try {
      const fruits = await Fruit.find();
      res.json(fruits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  
})
app.post('/addFruit', async (req, res) => {
  try {
    // Extract the data sent from the frontend
    const { id, quantity } = req.body;

    // Ensure that the ID is converted to the correct type (ObjectId)
    const fruitId = mongoose.Types.ObjectId(id);

    // Find the fruit by its ID in the database
    const fruit = await Fruit.findById(fruitId);

    if (!fruit) {
      // If the fruit with the specified ID doesn't exist, return an error
      return res.status(404).json({ message: 'Fruit not found' });
    }

    // Update the quantity of the fruit in the database
    fruit.quantity += quantity;

    // Save the updated fruit to the database
    // await fruit.save();
    console.log(fruit)

    // Respond with a success message
    res.status(200).json({ message: 'Fruit quantity updated successfully' });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error adding fruit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.listen(port, () => console.log('running on ', port))