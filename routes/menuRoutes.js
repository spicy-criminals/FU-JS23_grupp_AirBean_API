const express = require("express");
const router = express.Router();
const menuData = require("../menu.json");
const { validateProductId } = require("../validators/menuValidators");
// const { validateProductId } = require("./menuRoutes");

router.get("/", (req, res) => {
  res.json(menuData.menu);
});

router.get("/:productId", (req, res) => {
  const productId = parseInt(req.params.productId);

  //kontrollerar om produkten finns i menu-json (matchar ett giltigt id)
  if (!validateProductId(productId.toString())) {
    return res.status(404).send("sorry, this product does not exist");
  }

  const product = menuData.menu.find((p) => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).send("sorry, couldn't find this product");
  }
});

router.get("/", (req, res) => {});

module.exports = router;
