const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser } = require("../controllers/UserController");
const { validateNewUser, validate } = require("../validators/userValidators");
const { authenticate, authenticateAlt } = require("../middlewares/auth");

///////// REQUESTS //////////

///// GET USERS /////
router.get("/", async (req, res) => {
  try {
    const users = await db.find({});
    res.send(users);
  } catch (error) {
    res.status(404).send({ error: "Could not find any users :(" });
  }
});

////// SIGN UP ///////
router.get("/signup", (req, res) => {
  res.send({ message: "Make a post-request to sign up! :)" });
});
router.post("/signup", validateNewUser(), validate, createUser);

///////// LOGIN ////////

router.get("/login", (req, res) => {
  res.send({ message: "Make a post-request to login up! :)" });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.findOne({ username: username });

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
});

// get a specific user
router.get("/user/:username", async (req, res) => {
  // const userId = req.params.userId;
  const username = req.params.username;

  try {
    const user = await db.findOne({ username: username });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: "Server error" });
  }
});

// Delete a specific user
router.delete("/user/:username", authenticateAlt, async (req, res) => {
  const username = req.params.username;

  // uses the payload from the token to confirm that you're not trying delete somebody else's account
  const userId = req.user.userId;
  const targetedUser = await db.findOne({ username: username });
  if (!targetedUser) {
    res.status(404).send({ error: "User not found" });
    return;
  }
  if (userId != targetedUser.userId) {
    res
      .status(403)
      .send({ error: "You cannot delete somebody else's account" });
    return;
  }

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
});

module.exports = { router };
