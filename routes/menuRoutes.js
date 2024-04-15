const express = require("express");
const router = express.Router();
const menuData = require("../menu.json");
const { getMenuItem } = require("../controllers/MenuController");

router.get("/", (req, res) => {
  res.json(menuData.menu);
});

router.get("/:itemId", getMenuItem, (req, res) => {
  res.json(req.item);
});

module.exports = router;
