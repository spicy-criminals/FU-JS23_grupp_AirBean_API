const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../database.js");
const userId = uuidv4();

async function createUser(req, res) {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      userId,
      username,
      password: hashedPassword,
    };

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