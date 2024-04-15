const express = require("express");
const router = express.Router();
const db = require("../database");
const { createUser } = require("../controllers/UserController");
const { validateNewUser, validate } = require("../validators/userValidators");

/*
GET /users för att hämta alla användare.
POST /users för att skapa en ny användare.
GET /users/:id för att hämta en specifik användare.
PUT /users/:id för att uppdatera en specifik användare.
DELETE /users/:id för att radera en specifik användare.
*/

///////// REQUESTS //////////

router.get("/", async (req, res) => {
  try {
    const users = await db.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: "Kunde inte hämta användare" });
  }
});

//post-request föratt skapa användare
router.post("/", validateNewUser(), validate, createUser);

// put
router.put("/", (req, res) => {
  res.send({ data: "updated" });
});

//delete
router.delete("/", async (req, res) => {
  try {
    const result = await db.remove({}, { multi: true });
    res.send({ message: "Alla användare raderade", deletedCount: result });
  } catch (error) {
    res.status(500).send({ error: "Kunde inte radera användare" });
  }
  // res.send({ data: "deleted" });
});

module.exports = router;
