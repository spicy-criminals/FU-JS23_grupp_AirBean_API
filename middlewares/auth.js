const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied: No Token Provided!");
};

const authenticateAlt = (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("No valid token provided");
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      res.status(403).send({ error: "Invalid token" });
      return;
    }
    req.user = user;
    console.log(req.user);
    next();
  });
};

module.exports = { authenticate, authenticateAlt };