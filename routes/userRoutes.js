const express = require("express");
const router = express.Router();
const db = require("../database");
const { createUser } = require("../controllers/UserController");
const { validateNewUser, validate } = require("../validators/userValidators");

/*
GET /users to retrieve all users.
POST /users to create a new user.
GET /users/:id to retrieve a specific user.
PUT /users/:id to update a specific user.
DELETE /users/:id to delete a specific user.
*/

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
    const result = await db.update({ _id: req.params.id }, { $set: updateData }, { returnUpdatedDocs: true });
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

module.exports = router;
