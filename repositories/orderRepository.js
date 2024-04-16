const db = require("../menu.json"); // replace './db' with the path to your actual database file
const { isBefore } = require("date-fns"); // import the isBefore function for date comparison

async function createOrder(userId, productId, price) {
  // Insert the new order into the database
  await db.insert({ userId, productId, price, timestamp: new Date() });
}

async function getOngoingOrders(currentTime) {
  // Fetch all orders from the database
  const ongoingOrders = await db.find({});

  // Filter the orders based on the current time
  const filteredOngoingOrders = ongoingOrders.filter((order) => {
    const orderTime = new Date(order.timestamp);
    return isBefore(orderTime, currentTime);
  });

  return filteredOngoingOrders;
}

async function getOrderHistory(userId) {
  // Fetch all orders for the user from the database
  const orderHistory = await db.find({ userId });

  return orderHistory;
}

module.exports = { createOrder, getOngoingOrders, getOrderHistory };
