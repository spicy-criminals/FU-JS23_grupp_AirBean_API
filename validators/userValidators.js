const { body, validationResult } = require("express-validator");

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

module.exports = {
  validateNewUser,
  validate,
};
