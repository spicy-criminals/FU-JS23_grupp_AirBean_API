const menuData = require("../menu.json");

function getMenu() {
  return menuData.menu;
}

function getMenuItem(productId) {
  const product = menuData.menu.find((item) => item.id === parseInt(productId));

  return product;
}

module.exports = { getMenu, getMenuItem };
