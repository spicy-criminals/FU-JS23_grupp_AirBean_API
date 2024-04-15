const menuData = require("../menu.json");

async function getMenu(req, res) {
  try {
    const menu = await menuData.menu;
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

async function getMenuItem(req, res) {
  try {
    const itemId = parseInt(req.params.itemId);
    const item = await menuData.menu.find((item) => item.id === itemId);

    if (!item) {
      return res.status(404).json({ error: "Artikeln hittades inte" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}

module.exports = { getMenu, getMenuItem };