const express = require("express");
const router = express.Router();

// REQUESTS

// get-request föratt visa user-sidan
router.get("/", (req, res) => {
  res.send({ data: "please sign up" });
});

//post-request föratt skapa användare
router.post("/", (req, res) => {
  res.send({ data: "created" });
});

router.put("/", (req, res) => {
  res.send({ data: "updated" });
});

router.delete("/", (req, res) => {
  res.send({ data: "deleted" });
});

module.exports = router;
