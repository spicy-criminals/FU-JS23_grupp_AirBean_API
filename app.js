const express = require("express");
const path = require("path");
const Datastore = require("nedb-promise");
const { format, isBefore } = require("date-fns");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize database
const db = new Datastore({ filename: "database.db", autoload: true });

// Import controllers and routes
const OrderController = require("./controllers/OrderController");
const MenuController = require("./controllers/MenuController");
const menuRoutes = require("./routes/menuRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse JSON bodies
app.use(express.json());

// Route handling
app.use("/user", userRoutes);
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);
app.use(errorHandler);

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
