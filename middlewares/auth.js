
function authenticate(req, res, next) {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];


  if (!token) {
    res.status(401).send("No valid token provided");
    return;
  }


};

// Takes { "authorization": Bearer <token> } in header
const authenticateAlt = (req, res, next) => {
  const authorization = req.headers["authorization"];
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("No valid token provided");
    return;
  }


    console.log(req.user);
    next();
  });
}
module.exports = authenticate;

