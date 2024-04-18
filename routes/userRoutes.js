const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  createUser,
  deleteUserMiddleware,
  getUser,
  login,
  getAllUsers,
} = require("../controllers/UserController");
const {
  validateNewUser,
  validate,
  checkLogin,
} = require("../validators/userValidators");
const { authenticateAlt } = require("../middlewares/auth");

// show all users
router.get("/", getAllUsers);

// sign up
router.get("/signup", (req, res) => {
  res.send({ message: "Make a post-request to sign up! :)" });
});

router.post("/signup", validateNewUser(), validate, createUser);

// log in
router.get("/login", (req, res) => {
  res.send({ message: "Make a post-request to login up! :)" });
});
router.post("/login", login);

// show a specific user
router.get("/user/:username", getUser);
// delete a user
router.delete(
  "/user/:username",
  authenticateAlt,
  checkLogin,
  deleteUserMiddleware
);

module.exports = { router };
