const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../database");
const jwt = require("jsonwebtoken");
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByUsername } = require("../repositories/userRepository")

async function createUser(req, res) {
  const { username, password } = req.body;

  try {
    const userId = uuidv4();
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

async function deleteUserMiddleware(req, res) {
  const username = req.params.username;

  try {
    const result = await db.remove({ username: username }, {});
    console.log("hello");
    if (result > 0) {
      res.send({ message: "User deleted", username: username });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
}

async function getUser(req, res) {
  const username = req.params.username;

  try {
    const user = getUserByUsername(username);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = getUserByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).send("Incorrect username or password");
      return;
    }

    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    res
      .status(200)
      .json({ user: username, message: "You are logged in", token });
  } catch (error) {
    res.status(500).send({ error: "Could not log in" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = getUsers();
    res.send(users);
  } catch (error) {
    res.status(404).send({ error: "Could not find any users :(" });
  }
}

module.exports = {
  createUser,
  deleteUserMiddleware,
  getUser,
  login,
  getAllUsers,
};