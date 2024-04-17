/*
 
Summary:
 * This code initializes a NeDB datastore instance, leveraging the 'nedb-promise' module for asynchronous operations.
 * It sets up the database with default options, including the filename and autoload settings. The exported NeDB
 * instance is accessible for use in other modules.
 * NeDB is a lightweight, file-based embedded database for Node.js, suitable for small to medium-sized datasets.

*/

const Datastore = require("nedb-promise");

const db = new Datastore({
  filename: "./database.db",
  autoload: true,
});

module.exports = db;