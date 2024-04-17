/* 
This code sets up a connection to a NeDB database stored in "./orders.db" file.
It provides functions to create orders, retrieve ongoing orders based on the current time, and retrieve order history for a specific user.

createOrder(userId, productId, price): 
    - Creates a new order with the provided user ID, product ID, and price.
    - Generates order and delivery dates and inserts the order into the database.

getOngoingOrders(currentTime): 
    - Retrieves ongoing orders based on the current time.
    - Filters orders to find those whose order date is before the current time and delivery date is after the current time.

getOrderHistory(userId): 
    - Retrieves the order history for a specific user based on the provided user ID.
*/
const Datastore = require("nedb");
const db = new Datastore({
  filename: "./orders.db",
  autoload: true,
});
const { isBefore, add, format } = require("date-fns");

function createOrder(userId, productId, price) {
  return new Promise((resolve, reject) => {
    const orderDate = format(new Date(), "yyyy-MM-dd HH:mm");
    const deliveryDate = format(
      add(new Date(), { hours: 2 }),
      "yyyy-MM-dd HH:mm"
    );

    db.insert(
      { userId, productId, price, orderDate, deliveryDate },
      (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc);
      }
    );
  });
}

function getOngoingOrders(currentTime) {
  return new Promise((resolve, reject) => {
    db.find({}, (err, docs) => {
      if (err) reject(err);
      else {
        const filteredOngoingOrders = docs.filter((order) => {
          const orderTime = new Date(order.orderDate);
          const deliveryTime = new Date(order.deliveryDate);
          return (
            isBefore(orderTime, currentTime) &&
            isBefore(currentTime, deliveryTime)
          );
        });
        resolve(filteredOngoingOrders);
      }
    });
  });
}

function getOrderHistory(userId) {
  return new Promise((resolve, reject) => {
    db.find({ userId }, (err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
}

module.exports = { createOrder, getOngoingOrders, getOrderHistory };
