const Datastore = require("nedb");
const db = new Datastore({
  filename: "./orders.db",
  autoload: true,
});
const { isBefore, add, format } = require("date-fns");

function createOrder(userId, productId, price) {
  return new Promise((resolve, reject) => {
    // Get the current date and time and format it
    const orderDate = format(new Date(), "yyyy-MM-dd HH:mm");
    const deliveryDate = format(
      add(new Date(), { hours: 2 }),
      "yyyy-MM-dd HH:mm"
    ); // adds 2 hours to the order date and formats it

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
