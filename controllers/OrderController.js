const { validationResult } = require('express-validator');

// Function to create a new order
async function createOrder(req, res) {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data from request body
    const { userId, productId, price } = req.body;

    // Find the product in the menu
    const product = menuData.menu.find(item => item.id === parseInt(productId));

    // Check if product exists and if price matches
    if (!product || product.price !== parseFloat(price)) {
      return res.status(400).json({ error: "Invalid product or price" });
    }

    // Insert order into the database
    await db.insert({ userId, productId, price, timestamp: new Date() });

    // Respond with success message
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to get ongoing orders
async function getOngoingOrders(req, res) {
  try {
    // Get current time
    const currentTime = new Date();

    // Find ongoing orders from the database
    const ongoingOrders = await db.find({ timestamp: { $lt: currentTime } });

    // Respond with ongoing orders
    res.json(ongoingOrders);
  } catch (error) {
    // Handle errors
    console.error("Error fetching ongoing orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Function to get order history for a specific user
async function getOrderHistory(req, res) {
  try {
    // Extract userId from request parameters
    const userId = req.params.userId;

    // Find order history for the specified user
    const orderHistory = await db.find({ userId });

    // Respond with order history
    res.json(orderHistory);
  } catch (error) {
    // Handle errors
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Export functions for use in other modules
module.exports = { createOrder, getOngoingOrders, getOrderHistory };