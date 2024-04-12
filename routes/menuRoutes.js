const express = require("express");
const router = express.Router();
const menuData = require("../menu.json");

router.get("/", (req, res) => {
  res.json(menuData.menu);
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
