const express = require("express");
const expensesController = require("../controllers/expense.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const authenticate = require("../middlewares/auth");

const router = express.Router();

module.exports.setup = (app) => {
	app.use("/api/v1/expenses", router);

	/**
	 * @swagger
	 * /api/v1/expenses:
	 *   get:
	 *     summary: Get all expenses
	 *     tags: [Expenses]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: List of all expenses
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 status:
	 *                   type: string
	 *                   description: The response status
	 *                   enum: [success]
	 *                 data:
	 *                   type: object
	 *                   properties:
	 *                     type: array
	 *                     items:
	 *                       $ref: '#/components/schemas/Expense'
	 */
	router.get("/", authenticate, expensesController.getExpenses);

	/**
	 * @swagger
	 * /api/v1/expenses:
	 *   post:
	 *     summary: Create a new expense
	 *     tags: [Expenses]
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - category
	 *               - amount
	 *               - date
	 *             properties:
	 *               category:
	 *                 type: string
	 *                 description: Category name
	 *               amount:
	 *                 type: number
	 *                 format: float
	 *                 description: Expense amount
	 *               date:
	 *                 type: string
	 *                 format: date
	 *                 description: Date
	 *               description:
	 *                 type: string
	 *                 description: Detail for expense
	 *             example:
	 *               category: Food
	 *               amount: 50000
	 *               date: 2024-10-09
	 *               description: Lunch
	 *     responses:
	 *       201:
	 *         description: Expense created
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 status:
	 *                   type: string
	 *                   description: The response status
	 *                   enum: [success]
	 *                 data:
	 *                   type: object
	 *                   properties:
	 *                     type: array
	 *                     items:
	 *                       $ref: '#/components/schemas/Expense'
	 */
	router.post("/", authenticate, expensesController.createExpense);

	/**
	 * @swagger
	 * /api/v1/expenses/{id}:
	 *   put:
	 *     summary: Update an expense
	 *     tags: [Expenses]
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         schema:
	 *           type: integer
	 *         required: true
	 *         description: Expense ID
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             properties:
	 *               category:
	 *                 type: string
	 *               amount:
	 *                 type: number
	 *               date:
	 *                 type: string
	 *                 format: date
	 *               description:
	 *                 type: string
	 *             example:
	 *               category: Taxi
	 *               amount: 100000
	 *               date: 2024-10-09
	 *               description: Taxi fee
	 *     responses:
	 *       200:
	 *         description: Expense updated
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: object
	 *               properties:
	 *                 status:
	 *                   type: string
	 *                   description: The response status
	 *                   enum: [success]
	 *                 data:
	 *                   type: object
	 *                   properties:
	 *                     type: array
	 *                     items:
	 *                       $ref: '#/components/schemas/Expense'
	 */
	router.put("/:id", authenticate, expensesController.updateExpense);

	/**
	 * @swagger
	 * /api/v1/expenses/{id}:
	 *   delete:
	 *     summary: Delete an expense
	 *     tags: [Expenses]
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         schema:
	 *           type: integer
	 *         required: true
	 *         description: Expense ID
	 *     responses:
	 *       200:
	 *         description: Expense deleted
	 *         $ref: '#/components/responses/200NoData'
	 */
	router.delete("/:id", authenticate, expensesController.deleteExpense);

	router.all("/", methodNotAllowed);
};
