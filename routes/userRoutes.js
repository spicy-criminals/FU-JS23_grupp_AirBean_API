const express = require("express");
const router = express.Router();
const db = require("../database");
const { createUser } = require("../controllers/UserController");
const { validateNewUser, validate } = require("../validators/userValidators");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = "your_secret_key_here"; // Use a stronger secret key

///////// REQUESTS //////////

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await db.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: "Could not retrieve users" });
  }
});

// Create a new user
router.post("/", validateNewUser(), validate, createUser);

// Retrieve a specific user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await db.findOne({ _id: req.params.id });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Could not retrieve user" });
  }
});

// Update a specific user by ID
router.put("/:id", validateNewUser(), validate, async (req, res) => {
  try {
    const updateData = req.body;
    const result = await db.update(
      { _id: req.params.id },
      { $set: updateData },
      { returnUpdatedDocs: true }
    );
    if (result.nModified > 0) {
      res.send({ message: "User information updated", userId: req.params.id });
    } else {
      res.status(404).send({ error: "No user found for update" });
    }
  } catch (error) {
    res.status(500).send({ error: "Could not update user" });
  }
});

// Delete a specific user by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await db.remove({ _id: req.params.id }, {});
    if (result > 0) {
      res.send({ message: "User deleted", userId: req.params.id });
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Could not delete user" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.findOne({ username: username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).send("Incorrect username or password");
      return;
    }

    const token = jwt.sign({ userID: user.userID }, JWT_SECRET, {
      expiresIn: "30m",
    });

    res
      .status(200)
      .json({ user: username, message: "You are logged in", token });
  } catch (error) {
    res.status(500).send({ error: "Could not log in" });
  }
});

// Token authentication middleware
const authenticate = (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("No valid token provided");
    return;
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      res.status(403).send({ error: "Invalid token" });
      return;
    }
    req.user = user;
    next();
  });
};

module.exports = { router, authenticate };