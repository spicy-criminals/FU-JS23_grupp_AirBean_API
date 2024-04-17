const { validationResult } = require("express-validator");
const { getMenuItem } = require("../repositories/menuRepository");
const { findMenuItem } = require("../controllers/MenuController");
const {
  createOrder: createOrderInRepo,
  getOngoingOrders: getOngoingOrdersInRepo,
  getOrderHistory: getOrderHistoryInRepo,
} = require("../repositories/orderRepository");
const { format } = require("date-fns");

async function createOrder(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const orders = req.body;

    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    for (let order of orders) {
      const { userUuid, productId, price } = order;
      const orderDate = format(new Date(), "yyyy-MM-dd HH:mm");

      console.log(
        `userUuid: ${userUuid}, productId: ${productId}, price: ${price}, orderDate: ${orderDate}`
      );

      const product = findMenuItem(productId);

      console.log("Found product:", product);

      if (!product || product.price !== parseFloat(price)) {
        return res.status(400).json({ error: "Invalid product or price" });
      }

      await createOrderInRepo(userUuid, productId, price, orderDate);
      return res.status(200).send("Order succesful");
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
}

async function getOngoingOrders(req, res) {
  try {
    const currentTime = new Date();
    const ongoingOrders = await getOngoingOrdersInRepo(currentTime);
    res.json(ongoingOrders);
  } catch (error) {
    console.error("Error fetching ongoing orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getOrderHistory(req, res) {
  try {
    const userId = req.params.userId;
    const orderHistory = await getOrderHistoryInRepo(userId);
    res.json(orderHistory);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createOrder, getOngoingOrders, getOrderHistory };
