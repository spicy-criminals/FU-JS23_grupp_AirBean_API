const Datastore = require("nedb-promise");

const db = new Datastore({
  filename: "./database.db",
  autoload: true,
});

module.exports = db;
