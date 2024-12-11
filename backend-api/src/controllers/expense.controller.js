const expenseService = require("../services/expense.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function getExpenses(req, res) {
	try {
		const expenses = await expenseService.getAllExpenses(req.user.id);
		res.status(200).json(JSend.success({ expenses }));
	} catch (error) {
		next(new ApiError(500, "Error retrieving expenses"));
	}
}

async function createExpense(req, res, next) {
	if (!req.body?.category || typeof req.body.category !== "string") {
		return next(new ApiError(400, "Category cant be empty"));
	}
	if (!req.body?.amount || typeof req.body.amount !== "number") {
		return next(new ApiError(400, "Amount cant be empty"));
	}

	try {
		const expense = await expenseService.createExpense(
			req.user.id,
			req.body
		);
		return res
			.status(201)
			.set({
				Location: `${req.baseUrl}/${expense.id}`,
			})
			.json(JSend.success({ expense }));
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, "An error occurred while creating the expense")
		);
	}
}

async function updateExpense(req, res, next) {
	try {
		const updatedExpense = await expenseService.updateExpense(
			req.user.id,
			req.params.id,
			req.body
		);
		if (!updatedExpense) {
			return next(new ApiError(404, "Expense not found"));
		}
		return res.status(200).json(JSend.success({ updatedExpense }));
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, "An error occurred while updating the expense")
		);
	}
}

async function deleteExpense(req, res, next) {
	try {
		const deletedExpense = await expenseService.deleteExpense(
			req.user.id,
			req.params.id
		);
		if (!deletedExpense) {
			return next(new ApiError(404, "Expense not found"));
		}
		return res
			.status(200)
			.json(JSend.success({ message: "Expense deleted" }));
	} catch (error) {
		console.log(error);
		return next(
			new ApiError(500, "An error occurred while deleting the expense")
		);
	}
}

module.exports = {
	createExpense,
	updateExpense,
	deleteExpense,
	getExpenses,
};
