const express = require("express");
const router = express.Router();
const db = require("../database");
const { createUser } = require("../controllers/UserController");
const { validateNewUser, validate } = require("../validators/userValidators");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "1234"; //eller något starkare
const bcrypt = require("bcrypt")

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
  res.send({ message: "User information updated" });
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



//inloggning - verkar funka
router.post("/login", async (req, res) => {
  //try {
    const { username, password } = req.body

    const user = await db.find(user => user.username === username); //hämtar alla? med findOne hämtar den alltid den första ist för den som matchar användarnamnet???
    console.log(user, password, user.password)
    if (!user || !bcrypt.compareSync(password, user.password)) {
      res.status(401).send("Fel användarnamn eller lösenord");
      return
    }

    const token = jwt.sign({ "userId":user.userId }, JWT_SECRET, {expiresIn: "30m"}); //eller utan utgång
    res.status(200).json({ token })

  /* } catch (error) {
    res.status(500).send({error: "Kunde inte logga in"})
  } */
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
