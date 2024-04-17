const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createUser, deleteUser, getUser, login, getAllUsers } = require("../controllers/UserController");
const { validateNewUser, validate, checkLogin } = require("../validators/userValidators");
const { authenticate, authenticateAlt } = require("../middlewares/auth");


router.get("/", getAllUsers);

router.get("/signup", (req, res) => {
  res.send({ message: "Make a post-request to sign up! :)" });
});

router.post("/signup", validateNewUser(), validate, createUser);

router.get("/login", (req, res) => {
  res.send({ message: "Make a post-request to login up! :)" });
});

router.post("/login", login);

router.get("/user/:username", getUser);

router.delete("/user/:username", authenticateAlt, checkLogin, deleteUser);

module.exports = { router };
