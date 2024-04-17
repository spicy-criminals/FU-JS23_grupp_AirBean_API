const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/OrderController");
const { validateOrder } = require("../validators/orderValidators");

// GET request: Retrieve data
router.get("/", (req, res) => {
  res.send({ message: "Here is your data" });
});

// POST request: Create new data
router.post("/", (req, res) => {
  res.send({ message: "Data created" });
});

// PUT request: Update existing data
router.put("/", (req, res) => {
  res.send({ message: "Data updated" });
});

// DELETE request: Delete existing data
router.delete("/", (req, res) => {
  res.send({ message: "Data deleted" });
});







// POST request to create a new order
router.post("/", validateOrder, createOrder);








module.exports = router;