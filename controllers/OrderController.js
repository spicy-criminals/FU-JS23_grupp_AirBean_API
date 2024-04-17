const { validationResult } = require("express-validator");
const { getMenuItem } = require("../repositories/menuRepository");
const { findMenuItem } = require("../controllers/MenuController");
const {
  createOrder: createOrderInRepo,
  getOngoingOrders: getOngoingOrdersInRepo,
  getOrderHistory: getOrderHistoryInRepo,
} = require("../repositories/orderRepository");
const { format } = require("date-fns");

// Function to create a new order
async function createOrder(req, res) {
  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orders = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    for (let order of orders) {
      const { userUuid, productId, price } = order; // Replace userId with userUuid

      // Get the current date and time and format it
      const orderDate = format(new Date(), "yyyy-MM-dd HH:mm");

      console.log(
        `userUuid: ${userUuid}, productId: ${productId}, price: ${price}, orderDate: ${orderDate}` // Replace userId with userUuid
      ); // Log the values

      const product = findMenuItem(productId);

      console.log("Found product:", product); // Log the found product

      if (!product || product.price !== parseFloat(price)) {
        return res.status(400).json({ error: "Invalid product or price" });
      }

      // Include the orderDate when creating the order in the repository
      await createOrderInRepo(userUuid, productId, price, orderDate); // Replace userId with userUuid
      return res.status(200).send("Order succesful");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
}

// Function to get ongoing orders
async function getOngoingOrders(req, res) {
  try {
    // Get current time
    const currentTime = new Date();

    // Find ongoing orders from the database
    const ongoingOrders = await getOngoingOrdersInRepo(currentTime);

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
    const orderHistory = await getOrderHistoryInRepo(userId);

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
