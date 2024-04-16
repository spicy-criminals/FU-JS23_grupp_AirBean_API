const express = require("express");
const router = express.Router();
const db = require("../database");
const { createUser } = require("../controllers/UserController");
const { validateNewUser, validate } = require("../validators/userValidators");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "1234"; //eller något starkare
const bcrypt = require("bcrypt")

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



//inloggning - verkar funka nu
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    //försök 1
    /* const user = await db.find(user => user.username === username); //hämtar alla? med findOne hämtar den alltid den första ist för den som matchar användarnamnet???
    console.log(user, password, user.password) */

    //försök 2
    /* db.findOne({ "username": username }, (error, user) => { //fastnar på "sending request"
      if (error) {
        res.status(500).send({ message: "Kunde inte logga in"});
        return
      }
      if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401).send("Fel användarnamn eller lösenord")
        return
      }
      const token = jwt.sign({ "userId":user.userId }, JWT_SECRET, {expiresIn: "30m"}); //eller utan utgång
      res.status(200).json({ token })
    }) */

    //försök 3
    const user = await db.findOne({ "username":username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).send("Fel användarnamn eller lösenord");
      return
    }
    const token = jwt.sign({ "userID":user.userID }, JWT_SECRET, {expiresIn: "30m"})
    res.status(200).json({ token })

    /* if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).send("Fel användarnamn eller lösenord");
      return
    } */

    

  } catch (error) {
    res.status(500).send({error: "Kunde inte logga in"})
  }
})


//tokenautentisering - ej testat, bör förmodligen ligga annanstans
authenticate = (req, res, next) => {
  const authorisation = req.headers["authorization"]; //bör skickas med som "Authorization: Bearer {token}" - kan alternativt skickas i body
  const token = authorisation && authorisation.split(' ')[1]; //plockar ut tokenet ur ovan beskrivna formatet

  if (!token) {
    res.status(401).send("Inget giltigt token skickades med");
    return
  }

  jwt.verify(token, JWT_SECRET, (error, user) => {
    if (error) {
      res.status(403).send({ error:"Ogiltigt token" });
      return
    }
    req.user = user; //userID läggs till i bodyn om tokenet stämmer
    next()
  })
}

module.exports = router;