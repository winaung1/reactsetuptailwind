const express = require('express');
const router = express.Router();
const fruitController = require('../controllers/fruitController');

// Route to add a new fruit
router.post('/fruits', fruitController.addFruit);

// Route to get all fruits
router.get('/fruits', fruitController.getAllFruits);

// Route to get a specific fruit by ID
router.get('/fruits/:id', fruitController.getFruitById);

// Route to update a fruit by ID
router.patch('/fruits/:id', fruitController.updateFruitById);

// Route to delete a fruit by ID
router.delete('/fruits/:id', fruitController.deleteFruitById);

module.exports = router;
