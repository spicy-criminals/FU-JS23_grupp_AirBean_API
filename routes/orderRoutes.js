const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderHistory,
} = require("../controllers/OrderController");
//skapa en order
router.post("/", createOrder);

//se order history
router.get("/:userId/history", getOrderHistory);

// PUT request: Update existing data
router.put("/", (req, res) => {
  res.send({ message: "Data updated" });
});

// DELETE request: Delete existing data
router.delete("/", (req, res) => {
  res.send({ message: "Data deleted" });
});

module.exports = router;
