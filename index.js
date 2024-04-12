const express = require("express");
const Datastore = require("nedb-promise"); // Importerar NeDB-promise, en inbäddad databas för Node.js som använder promises.
const { v4: uuidv4 } = require("uuid"); // Importerar uuid för att generera unika identifierare.
const { body, validationResult } = require("express-validator"); // Importerar valideringsverktyg från express-validator.
const { format, isBefore } = require("date-fns"); // Importerar datumfunktioner från date-fns.
// Laddar menydata från en lokal JSON-fil.
const { parseISO } = require("date-fns/fp"); // Importerar en funktion för att tolka ISO-strängar från date-fns/fp.

// Skapar en ny databasinstans, specificerar filnamnet och att databasen ska laddas automatiskt.
const db = new Datastore({ filename: "database.db", autoload: true });

// Middleware för validering av användarinput
const validateOrder = [
  // Validerar att 'userId' är ett giltigt UUID-format
  body("userId").isUUID().withMessage("Ogiltigt användar-ID-format"),

  // Validerar att 'productId' är ett heltal och verifierar dess giltighet mot en produktlista
  body("productId")
    .isInt()
    .withMessage("Produkt-ID måste vara ett heltal")
    .custom((value) => {
      // Söker igenom menydata för att hitta en produkt med angivet ID
      const produkt = menyData.meny.find((item) => item.id === value);
      // Om inget giltigt produkt-ID hittas, kastas ett fel
      if (!produkt) {
        throw new Error("Ogiltigt produkt-ID");
      }
      // Returnerar sant om produkt-ID är giltigt
      return true;
    }),

  // Validerar att 'price' är ett numeriskt värde
  body("price").isNumeric().withMessage("Priset måste vara ett nummer"),
];

// Middleware för hantering av fel
const errorHandler = (err, req, res, next) => {
  // Skriver ut felstacken till konsolen för debugging
  console.error(err.stack);

  // Kontrollerar om felet är ett SyntaxError, har status 400 och är relaterat till request body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Returnerar ett felmeddelande med status 400 om JSON-innehållet i body är ogiltigt
    return res.status(400).json({ error: "Ogiltigt JSON-innehåll" });
  }

  // För alla andra typer av fel, returneras status 500 och ett generellt felmeddelande
  res.status(500).json({ error: err.message || "Internt serverfel" });
};

// Middleware för felhantering
app.use(errorHandler);
