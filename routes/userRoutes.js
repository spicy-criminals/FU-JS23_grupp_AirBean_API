const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser } = require("../controllers/UserController");
const { validateNewUser, validate } = require("../validators/userValidators");

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
router.delete("/user/:username", async (req, res) => {
  // const userId = req.params.userId;
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
});

////////// AUTH ///////////

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
