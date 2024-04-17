const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/OrderController"); // Import the createOrder function

//skapa en order
router.post("/", createOrder);

//se order history
router.get("/", (req, res) => {
  res.send({ message: "Here is your data" });
});

// PUT request: Update existing data
router.put("/", (req, res) => {
  res.send({ message: "Data updated" });
});

// DELETE request: Delete existing data
router.delete("/", (req, res) => {
  res.send({ message: "Data deleted" });
});

module.exports = router;
