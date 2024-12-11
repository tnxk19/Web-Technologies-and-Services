const express = require("express");
const usersController = require("../controllers/users.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");

const router = express.Router();

module.exports.setup = (app) => {
	app.use("/api/v1/users", router);

	/**
	 * @swagger
	 * /api/v1/users/register:
	 *   post:
	 *     summary: Register
	 *     tags: [Users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - name
	 *               - email
	 *               - password
	 *             properties:
	 *               name:
	 *                 type: string
	 *               email:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *             example:
	 *               name: Hoa
	 *               email: hoa@gmail.com
	 *               password: 12345678
	 *     responses:
	 *       201:
	 *         description: registered
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
	 *                       $ref: '#/components/schemas/User'
	 */
	router.post("/register", usersController.register);

	/**
	 * @swagger
	 * /api/v1/users/login:
	 *   post:
	 *     summary: Login
	 *     tags: [Users]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required:
	 *               - email
	 *               - password
	 *             properties:
	 *               email:
	 *                 type: string
	 *               password:
	 *                 type: string
	 *             example:
	 *               email: hoa@gmail.com
	 *               password: 12345678
	 *     responses:
	 *       200:
	 *         description: logged in
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
	 *                       $ref: '#/components/schemas/User'
	 */
	router.post("/login", usersController.login);

	router.all("/", methodNotAllowed);
};
