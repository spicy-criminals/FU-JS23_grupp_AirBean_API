const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // If the error is a SyntaxError with a 400 status and an invalid JSON body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON content" });
  }

  // For other errors, respond with a generic 500 status and error message
  res.status(500).json({ error: err.message || "Internal server error" });
};

module.exports = errorHandler;
