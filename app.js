const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const userRoutesModule = require("./routes/userRoutes");
const { router: userRoutes, authenticate } = userRoutesModule;
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use("/users", userRoutes);
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
process.env.JWT_SECRET = "The man in black fled across the desert, and the gunslinger followed";

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
