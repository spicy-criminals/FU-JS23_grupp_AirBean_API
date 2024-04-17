const { body, validationResult } = require("express-validator");
const db = require("../database")

const validateNewUser = () => [
  body("username").isString().withMessage("Användarnamn måste vara en sträng"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Lösenordet måste vara minst 6 tecken långt"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Checks that the user to be deleted is the same as the one logged in
async function checkLogin(req, res, next) {
  const username = req.params.username;
  const userId = req.user.userId;
  const targetedUser = await db.findOne({ username: username });
  if (!targetedUser) {
    res.status(404).send({ error: "User not found" });
    return;
  }
  console.log(userId, targetedUser.userId)
  if (userId != targetedUser.userId) {
    res
      .status(403)
      .send({ error: "You cannot delete somebody else's account" });
    return;
  }
  next()
}

module.exports = {
  validateNewUser,
  validate,
  checkLogin,
};
