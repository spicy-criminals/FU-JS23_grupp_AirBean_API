const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderHistory,
} = require("../controllers/OrderController");

router.post("/", createOrder);

router.get("/:userId/history", getOrderHistory);

router.put("/", (req, res) => {
  res.send({ message: "Data updated" });
});

router.delete("/", (req, res) => {
  res.send({ message: "Data deleted" });
});

module.exports = router;