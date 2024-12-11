const knex = require("../database/knex");

function expenseRepository() {
	return knex("expenses");
}

function categoryRepository() {
	return knex("categories");
}

async function getUserCategories(userId) {
	return knex("expenses")
		.join("categories", "expenses.category_id", "=", "categories.id")
		.where("expenses.user_id", userId)
		.select("categories.id", "categories.name", "categories.description")
		.distinct();
}

async function checkUserCategory(userId, categoryId) {
	return knex("expenses")
		.where({
			user_id: userId,
			category_id: categoryId,
		})
		.first();
}

function readExpense(payload, categoryId, userId) {
	return {
		user_id: userId,
		category_id: categoryId,
		amount: payload.amount,
		description: payload.description,
		date: payload.date,
	};
}

async function findOrCreateCategory(name) {
	let category = await categoryRepository().where("name", name).first();

	if (!category) {
		const [categoryId] = await categoryRepository().insert({ name });
		category = { id: categoryId, name };
	}

	return category;
}

async function createExpense(userId, payload) {
	const category = await findOrCreateCategory(payload.category);
	const expense = readExpense(payload, category.id, userId);

	const [id] = await expenseRepository().insert(expense);
	return { id, ...expense };
}

async function getExpenseById(id, userId) {
	return expenseRepository()
		.where({ id, user_id: userId })
		.select("*")
		.first();
}

async function getAllExpenses(userId) {
	return expenseRepository().where({ user_id: userId }).select("*");
}

async function updateExpense(userId, expenseId, payload) {
	const expense = await getExpenseById(expenseId, userId);

	if (!expense) return null;

	const category = await findOrCreateCategory(payload.category);
	const update = readExpense(payload, category.id, userId);

	await expenseRepository().where({ id: expenseId }).update(update);

	return { ...expense, ...update };
}

async function deleteExpense(userId, expenseId) {
	const deletedExpense = await getExpenseById(expenseId, userId);

	if (!deletedExpense) return null;

	await expenseRepository().where({ id: expenseId }).del();
	return deletedExpense;
}

module.exports = {
	createExpense,
	getExpenseById,
	updateExpense,
	deleteExpense,
	getAllExpenses,
	getUserCategories,
	checkUserCategory,
};
