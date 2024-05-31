const CompletedOrder = require('../Models/completedOrderModel')

const getAllCompletedOrder = async (req, res) => {
    try {
      // Query the database to get all items
      const items = await CompletedOrder.find();
      // Send the retrieved items as a response
      res.json(items);
    } catch (error) {
      // Handle errors
      console.error("Error fetching items:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  const getOneCompletedOrder = async (req, res) => {
    const { email } = req.params; // Extract the email from request parameters
  
    try {
      // Query the database to find a completed order associated with the specified email
      const order = await CompletedOrder.find({ current_user: email });
  
      if (!order) {
        return res.status(404).json({ message: "Order not found for this user" });
      }
  
      // Send the retrieved order as a response
      res.json(order);
    } catch (error) {
      // Handle errors
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const updateCompletedOrder = async (req, res) => {
    const { id } = req.body; // Assuming 'id' is the ID of the order to update
    
    try {
      // Find and update the order with the specified ID
      const updatedOrder = await CompletedOrder.findOneAndUpdate(
        { _id: id }, // Filter criteria: find order by ID
        { completed: true }, // Update: set 'completed' field to true
        { new: true } // Options: return the updated document
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Send the updated order as a response
      res.json(updatedOrder);
    } catch (error) {
      // Handle errors
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  

  const addToCompletedOrder = async (req, res) => {
    const { item } = req.body; // Assuming req.body.items is an array of objects
  
    try {
      // Insert multiple items into the CompletedOrder collection
      const insertedItems = await CompletedOrder.insertMany(item);
  
      // Respond with a success message and the inserted items
      res.status(201).json({
        message: 'Items added to completed orders successfully',
        items: insertedItems
      });
    } catch (error) {
      console.error('Error adding items to completed orders:', error);
      // Handle the error and send an appropriate response
      res.status(500).json({ message: 'Failed to add items to completed orders' });
    }
  };
  





  module.exports = {updateCompletedOrder,getAllCompletedOrder, addToCompletedOrder, getOneCompletedOrder}