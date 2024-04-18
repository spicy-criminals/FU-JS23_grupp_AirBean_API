const Datastore = require("nedb");
const db = new Datastore({
  filename: "./orders.db",
  autoload: true,
});
const { isBefore, add, format } = require("date-fns");

function createOrder(userUuid, productId, price) {
  return new Promise((resolve, reject) => {
    const orderDate = format(new Date(), "yyyy-MM-dd HH:mm");
    const deliveryDate = format(
      add(new Date(), { hours: 2 }),
      "yyyy-MM-dd HH:mm"
    );

    db.insert(
      { userUuid, productId, price, orderDate, deliveryDate },
      (err, newDoc) => {
        if (err) reject(err);
        else resolve(newDoc);
      }
    );
  });
}

function removeProduct(productId) {
  return new Promise((resolve, reject) => {
    db.remove({ _id: productId }, { multi: true }, (err, numRemoved) => {
      if (err) reject(err);
      else resolve(numRemoved);
    });
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

function getOrderHistory(userUuid) {
  return new Promise((resolve, reject) => {
    db.find({ userUuid }, (err, docs) => {
      if (err) reject(err);
      else resolve(docs);
    });
  });
}

module.exports = {
  createOrder,
  removeProduct,
  getOngoingOrders,
  getOrderHistory,
};
