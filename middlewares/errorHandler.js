const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Ogiltigt JSON-innehåll" });
  }

  res.status(500).json({ error: err.message || "Internt serverfel" });
};

module.exports = errorHandler;
