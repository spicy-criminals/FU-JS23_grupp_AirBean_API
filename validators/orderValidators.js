const { body } = require("express-validator");
const menuData = require("../menu.json");

const validateOrder = [
  body("userId").isUUID().withMessage("Ogiltigt användar-ID-format"),

  body("productId")
    .isInt()
    .withMessage("Produkt-ID måste vara ett heltal")
    .custom((value) => {
      const produkt = menuData.menu.find((item) => item.id === value);
      if (!produkt) {
        throw new Error("Ogiltigt produkt-ID");
      }
      return true;
    }),

  body("price").isNumeric().withMessage("Priset måste vara ett nummer"),
];

module.exports = validateOrder;
