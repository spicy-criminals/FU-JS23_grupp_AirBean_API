const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ data: "here is your data" });
});

router.post("/", (req, res) => {
  res.send({ data: "created" });
});

router.put("/", (req, res) => {
  res.send({ data: "updated" });
});

router.delete("/", (req, res) => {
  res.send({ data: "deleted" });
});

module.exports = router;