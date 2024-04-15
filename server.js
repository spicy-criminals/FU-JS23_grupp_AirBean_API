const express = require("express");
const app = express();
const path = require("path");
const PORT = 8000;

// route variables
const menuRoutes = require("./routes/menuRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
app.use("/user", userRoutes);
app.use("/menu", menuRoutes);
app.use("/order", orderRoutes);

// sending html file with linked stylesheet
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// server listening to port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
