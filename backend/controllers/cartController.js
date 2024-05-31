const CartItem  = require('../Models/CartItemModel')

const getAllCart = async (req, res) => {
    try {
      // Query the database to get all items
      const items = await CartItem.find();
      // Send the retrieved items as a response
      res.json(items);
    } catch (error) {
      // Handle errors
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
const getOneCart = async (req, res) => {
  const {id} = req.params
    try {
      // Query the database to get all items
      const items = await CartItem.find({current_user: id});
      // Send the retrieved items as a response
      res.json(items);
    } catch (error) {
      // Handle errors
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

const addToCart = async (req, res) => {
    const {current_user, item: { name, category, price, quantity, image }} = req.body;

    try {
      // Check if an item with the same details already exists in the cart
      let existingItem = await CartItem.findOne({
        current_user,
        name,
        category,
        price,
        image,
      });
  
      if (existingItem) {
        // If the item exists, update its quantity
        existingItem.quantity += quantity || 1; // Increment the quantity by the specified amount (default to 1 if not provided)
        await existingItem.save(); // Save the updated item
        res.status(200).json(existingItem); // Respond with the updated item
      } else {
        // If the item doesn't exist, create a new item and add it to the cart
        const newItem = await CartItem.create({
          current_user,
          name,
          category,
          price,
          quantity,
          image,
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
      const updatedItem = await CartItem.findByIdAndUpdate(
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
      const updatedItem = await CartItem.findByIdAndUpdate(
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
      const deletedItem = await CartItem.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  const clearCart = async (req, res) => {
    const {email} = req.params
    try {
      const deleteResult = await CartItem.deleteMany({current_user: email});
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
  



  module.exports = {getOneCart, getAllCart, addToCart, increaseItem, decreaseItem, deletItem, clearCart}