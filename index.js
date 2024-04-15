<<<<<<< HEAD
const express = require("express"); // Importerar Express-biblioteket för att hantera HTTP-anrop.
=======
const express = require("express");
>>>>>>> 6abf94141b84f778ecb91893f3d8aa1e2f0c0880
const Datastore = require("nedb-promise"); // Importerar NeDB-promise, en inbäddad databas för Node.js som använder promises.
const { v4: uuidv4 } = require("uuid"); // Importerar uuid för att generera unika identifierare.
const { body, validationResult } = require("express-validator"); // Importerar valideringsverktyg från express-validator.
const { format, isBefore } = require("date-fns"); // Importerar datumfunktioner från date-fns.
<<<<<<< HEAD
const menuData = require("./menu.json");
const { parseISO } = require("date-fns/fp"); // Importerar en funktion för att tolka ISO-strängar från date-fns/fp.
const OrderController = require("./controllers/OrderController");
const MenuController = require("./controllers/MenuController");

const app = express();
const PORT = 8000;
const server = app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});

=======
// Laddar menydata från en lokal JSON-fil.
const { parseISO } = require("date-fns/fp"); // Importerar en funktion för att tolka ISO-strängar från date-fns/fp.

// Skapar en ny databasinstans, specificerar filnamnet och att databasen ska laddas automatiskt.
>>>>>>> 6abf94141b84f778ecb91893f3d8aa1e2f0c0880
const db = new Datastore({ filename: "database.db", autoload: true });

const validateOrder = [
<<<<<<< HEAD
  body("userId").isUUID().withMessage("Ogiltigt användar-ID-format"),

=======
  // Validerar att 'userId' är ett giltigt UUID-format
  body("userId").isUUID().withMessage("Ogiltigt användar-ID-format"),

  // Validerar att 'productId' är ett heltal och verifierar dess giltighet mot en produktlista
>>>>>>> 6abf94141b84f778ecb91893f3d8aa1e2f0c0880
  body("productId")
    .isInt()
    .withMessage("Produkt-ID måste vara ett heltal")
    .custom((value) => {
<<<<<<< HEAD
      const produkt = menuData.menu.find((item) => item.id === value);
      if (!produkt) {
        throw new Error("Ogiltigt produkt-ID");
      }
      return true;
    }),

=======
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
>>>>>>> 6abf94141b84f778ecb91893f3d8aa1e2f0c0880
  body("price").isNumeric().withMessage("Priset måste vara ett nummer"),
];

const errorHandler = (err, req, res, next) => {
<<<<<<< HEAD
  console.error(err.stack);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Ogiltigt JSON-innehåll" });
  }

=======
  // Skriver ut felstacken till konsolen för debugging
  console.error(err.stack);

  // Kontrollerar om felet är ett SyntaxError, har status 400 och är relaterat till request body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // Returnerar ett felmeddelande med status 400 om JSON-innehållet i body är ogiltigt
    return res.status(400).json({ error: "Ogiltigt JSON-innehåll" });
  }

  // För alla andra typer av fel, returneras status 500 och ett generellt felmeddelande
>>>>>>> 6abf94141b84f778ecb91893f3d8aa1e2f0c0880
  res.status(500).json({ error: err.message || "Internt serverfel" });
};

app.use(errorHandler);
<<<<<<< HEAD

app.post(
  "/signup",
  [
    body("username")
      .isString()
      .withMessage("Användarnamn måste vara en sträng"),

    body("email").isEmail().withMessage("Ogiltig e-postadress"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Lösenordet måste vara minst 6 tecken långt"),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { username, email, password } = req.body;
      const userId = uuidv4();

      const existingUser = await db.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Användaren finns redan" });
      }

      await db.insert({ userId, username, email, password });

      res.status(201).json({ userId });
    } catch (error) {
      res.status(500).json({ error: error.message || "Internt serverfel" });
    }
  }
);

//route till signup

//get och post - post för att lägga till delete för anvädaren? inte säkert

//JWT för att skapa token för att användaren ska kunna logga in
=======
>>>>>>> 6abf94141b84f778ecb91893f3d8aa1e2f0c0880
