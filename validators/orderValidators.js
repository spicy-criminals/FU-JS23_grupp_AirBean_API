const express = require("express");

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

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Ogiltigt JSON-innehåll" });
  }

  res.status(500).json({ error: err.message || "Internt serverfel" });
};

app.use(errorHandler);
