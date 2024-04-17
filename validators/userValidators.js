const { body, validationResult } = require("express-validator");

// Create a reusable validator function
const validateNewUser = () => [
  body("username").isString().withMessage("Användarnamn måste vara en sträng"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Lösenordet måste vara minst 6 tecken långt"),
];

// Add validation to ensure that the same username and email cannot be registered more than once
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
