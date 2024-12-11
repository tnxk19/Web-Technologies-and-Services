const knex = require("../database/knex");

function userRepository() {
	return knex("users");
}

async function createUser(payload) {
	const [id] = await userRepository().insert(payload);
	return { id, ...payload };
}

async function getUserByEmail(email) {
	return userRepository().where("email", email).first();
}

async function getUserById(id) {
	return userRepository().where("id", id).first();
}

module.exports = {
	createUser,
	getUserByEmail,
};
