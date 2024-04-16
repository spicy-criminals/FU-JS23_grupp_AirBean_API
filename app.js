// Dependencies
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
// const { ErrorHandler } = require("./middlewares/errorHandler");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON bodies
app.use(express.json());

// Controllers and routes
const userRoutesModule = require("./routes/userRoutes");
const userRoutes = userRoutesModule.router;
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authenticate = userRoutesModule.authenticate;
const errorHandler = require("./middlewares/errorHandler");

// express router routes (variabler?)
app.use("/users", userRoutes);
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);
app.use(errorHandler);

// Constants
const PORT = process.env.PORT || 8000;

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/*app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});*/

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
