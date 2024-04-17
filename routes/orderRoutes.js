const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");

// cart routes
router.get("/cart", (req, res) => {
  res.send({ message: "Make a post request with " });
});

router.post("/cart", (req, res) => {
  res.send({ message: "Data created" });
});

router.delete("/cart", (req, res) => {
  res.send({ message: "Data deleted" });
});

// summary routes

// history routes

module.exports = router;
