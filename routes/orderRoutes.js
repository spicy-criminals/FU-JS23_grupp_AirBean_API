const express = require("express");
const router = express.Router();
const {
  createOrder,
  deleteProduct,
  getOrderHistory,
} = require("../controllers/OrderController");

router.get("/", (req, res) => {
  res.send({ message: "Make a post-request to place an order! :)" });
});

router.post("/", createOrder);

router.delete("/:productId", deleteProduct);

router.get("/:userId/history", getOrderHistory);

module.exports = router;
