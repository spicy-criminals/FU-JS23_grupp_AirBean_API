const menuData = require("../menu.json");

function getMenu(req, res) {
  try {
    const menu = menuData.menu;
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getMenuItem(req, res) {
  try {
    const itemId = parseInt(req.params.itemId);
    const item = menuData.menu.find((item) => item.id === itemId);

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { getMenu, getMenuItem };
