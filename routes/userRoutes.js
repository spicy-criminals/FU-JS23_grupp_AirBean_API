const express = require("express");
const router = express.Router();

// GET request to display the user page
router.get("/", (req, res) => {
  res.send({ message: "Please sign up" });
});

// POST request to create a new user
router.post("/", (req, res) => {
  res.send({ message: "User created" });
});

// PUT request to update user information
router.put("/", (req, res) => {
  res.send({ message: "User information updated" });
});

// DELETE request to delete a user
router.delete("/", (req, res) => {
  res.send({ message: "User deleted" });
});

module.exports = router;
