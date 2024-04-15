async function createOrder(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, productId, price } = req.body;

    const product = menuData.menu.find(
      (item) => item.id === parseInt(productId)
    );

    if (product.price !== parseFloat(price)) {
      return res.status(400).json({ error: "Ogiltigt pris för produkten" });
    }

    await db.insert({ userId, productId, price, timestamp: new Date() });

    res.status(201).json({ message: "Order placerad framgångsrikt" });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internt serverfel" });
  }
}

async function getOngoingOrders(req, res) {
  try {
    const currentTime = new Date();
    const ongoingOrders = await db.find({});

    const filteredOngoingOrders = ongoingOrders.filter((order) => {
      const orderTime = new Date(order.timestamp);
      return isBefore(orderTime, currentTime);
    });

    res.json(filteredOngoingOrders);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

async function getOrderHistory(req, res) {
  try {
    const userId = req.params.userId;
    const orderHistory = await db.find({ userId });

    res.json(orderHistory);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

module.exports = { createOrder, getOngoingOrders, getOrderHistory };
