const express = require("express"); // Importerar Express-biblioteket för att hantera HTTP-anrop.
const Datastore = require("nedb-promise"); // Importerar NeDB-promise, en inbäddad databas för Node.js som använder promises.
const { v4: uuidv4 } = require("uuid"); // Importerar uuid för att generera unika identifierare.
const { body, validationResult } = require("express-validator"); // Importerar valideringsverktyg från express-validator.
const { format, isBefore } = require("date-fns"); // Importerar datumfunktioner från date-fns.
const menuData = require("./menu.json");
const { parseISO } = require("date-fns/fp"); // Importerar en funktion för att tolka ISO-strängar från date-fns/fp.
const OrderController = require("./controllers/OrderController");
const MenuController = require("./controllers/MenuController");

const app = express();
const PORT = 8000;
const server = app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
});

const db = new Datastore({ filename: "database.db", autoload: true });

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
