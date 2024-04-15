// Dependencies
const express = require("express");
const path = require("path");
const Datastore = require("nedb-promise");
const { format, isBefore } = require("date-fns");
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Controllers and routes
const OrderController = require("./controllers/OrderController");
const MenuController = require("./controllers/MenuController");
const menuRoutes = require("./routes/menuRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Constants
const PORT = process.env.PORT || 8000;
const DATABASE_FILENAME = "database.db";

// Initialize Express app
const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/user", userRoutes);
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Initialize database
const db = new Datastore({ filename: DATABASE_FILENAME, autoload: true });

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
