const FavoriteItem  = require('../Models/FavoriteModel')

const getAllFav = async (req, res) => {
    try {
      // Query the database to get all items
      const items = await FavoriteItem.find();
      // Send the retrieved items as a response
      res.json(items);
    } catch (error) {
      // Handle errors
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  const getOneFav = async (req, res) => {
    const {id} = req.params
      try {
        // Query the database to get all items
        const items = await FavoriteItem.find({current_user: id});
        // Send the retrieved items as a response
        res.json(items);
      } catch (error) {
        // Handle errors
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }

const addToFav = async (req, res) => {
    const {current_user, item: { name, category, price, quantity, imageUrl }} = req.body;

    console.log(req.body)
    console.log(current_user)
    console.log(name)
    try {
      // Check if an item with the same details already exists in the cart
      let existingItem = await FavoriteItem.findOne({
        current_user,
        name,
        category,
        price,
        imageUrl,
      });
  
      if (existingItem) {
        res.status(200).json("item already exist"); // Respond with the updated item
      } else {
        // If the item doesn't exist, create a new item and add it to the cart
        const newItem = await FavoriteItem.create({
          current_user,
          name,
          category,
          price,
          quantity,
          imageUrl,
        });
        res.status(201).json(newItem); // Respond with the newly created item
      }
    } catch (error) {
      // Handle errors
      console.error("Error adding item to cart:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  }

  const increaseItem = async (req, res) => {
    try {
      const updatedItem = await FavoriteItem.findByIdAndUpdate(
        req.params.id,
        { $inc: { quantity: 1 } },
        { new: true }
      );
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

const decreaseItem = async (req, res) => {
    try {
      const updatedItem = await FavoriteItem.findByIdAndUpdate(
        req.params.id,
        { $inc: { quantity: -1 } },
        { new: true }
      );
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

const deletItem = async (req, res) => {
    try {
      const deletedItem = await FavoriteItem.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  const clearFav = async (req, res) => {
    const {id} = req.params
    try {
      const deleteResult = await FavoriteItem.deleteMany({current_user: id});
      console.log(deleteResult); // Log the result of the delete operation
      if (deleteResult.deletedCount > 0) {
        res.json({ message: "Cart cleared successfully" });
      } else {
        res.json({ message: "Cart is already empty" });
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  



  module.exports = {getOneFav,getAllFav, addToFav, increaseItem, decreaseItem, deletItem, clearFav}