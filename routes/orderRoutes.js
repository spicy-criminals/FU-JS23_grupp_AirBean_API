const express = require("express");
const router = express.Router();

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

module.exports = router;