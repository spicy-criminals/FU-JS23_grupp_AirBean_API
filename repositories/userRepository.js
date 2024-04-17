// userRepository.js
const db = require("../database.db"); //vet inte om jag "länkat" rätt här

async function getUsers() {
  return await db.find({});
}

async function getUserById(id) {
  return await db.findOne({ _id: id });
}

async function updateUser(id, updateData) {
  return await db.update(
    { _id: id },
    { $set: updateData },
    { returnUpdatedDocs: true }
  );
}

async function deleteUser(id) {
  return await db.remove({ _id: id }, {});
}

async function getUserByUsername(username) {
  return await db.findOne({ username: username });
}

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByUsername,
};
