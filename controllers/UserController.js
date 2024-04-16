const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../database.js");

async function createUser(req, res) {
  const { username, password } = req.body;

  // genererar ett unikt ID för den nya användaren med UUID
  const userId = uuidv4();

  try {
    // lösenordet krypteras innan det sparas. hashas med bcrypts hash-funktion 10 gånger.
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // objekt för ny användare
    const newUser = {
      userId,
      username,
      password: hashedPassword,
    };

    //användaruppgifter sparas i databasen
    const savedUser = await db.insert(newUser);

    res.status(201).send({
      message: "user created",
      user: { userId, username, hashedPassword },
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Internal server error", error: error.message });
  }
}

module.exports = {
  createUser,
};
