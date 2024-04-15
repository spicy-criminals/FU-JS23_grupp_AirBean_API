const { body, validationResult } = require("express-validator");
const Datastore = require("nedb-promise"); 


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
      };
  
});
    