const Datastore = require("nedb-promise");

const db = new Datastore({
  filename: "./users.db",
  autoload: true,
});

module.exports = db;