// Dependencies
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON bodies
app.use(express.json()); 

// Controllers and routes
const userRoutes = require("./routes/userRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

// express router routes (variabler?)
app.use("/user", userRoutes);
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);

// Constants
const PORT = process.env.PORT || 8000;

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
