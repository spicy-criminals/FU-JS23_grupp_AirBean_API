const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderHistory,
} = require("../controllers/OrderController");

router.get("/", (req, res) => {
  res.send({ message: "Make a post-request to place an order! :)" });
});

router.post("/", createOrder);

/*

*/

router.get("/:userId/history", getOrderHistory);

router.delete("/", (req, res) => {
  res.send({ message: "Data deleted" });
});

module.exports = router;
