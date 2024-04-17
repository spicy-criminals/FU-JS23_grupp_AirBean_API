const Datastore = require("nedb");
const db = new Datastore({
  filename: "./orders.db",
  autoload: true,
});
const { isBefore } = require("date-fns");

function createOrder(userId, productId, price) {
  return new Promise((resolve, reject) => {
    db.insert(
      { userId, productId, price, timestamp: new Date() },
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
          const orderTime = new Date(order.timestamp);
          return isBefore(orderTime, currentTime);
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
