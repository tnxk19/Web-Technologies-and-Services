const express = require("express");
const categoriesController = require("../controllers/categories.controller");
const { methodNotAllowed } = require("../controllers/errors.controller");
const authenticate = require("../middlewares/auth");

const swaggerJSDoc = require("swagger-jsdoc");
const { swaggerUi } = require("../docs/swagger");
const router = express.Router();
const multer = require("multer");
const upload = multer(); // Multer để xử lý multipart/form-data
module.exports.setup = (app) => {
	app.use("/api/v1/categories", router);
	/**
	 * @openapi
	 *  /api/v1/categories:
	 *      get:
	 *          summary: Get all categories
	 *          description: Retrieve a list of all categories from the database.
	 *          tags:
	 *            - Categories
	 *          security:
	 *            - bearerAuth: []
	 *          responses:
	 *            200:
	 *                description: A list of categories
	 *                content:
	 *                    application/json:
	 *                        schema:
	 *                            type: object
	 *                            properties:
	 *                                status:
	 *                                    type: string
	 *                                    enum: [success]
	 *                                data:
	 *                                    type: array
	 *                                    items:
	 *                                        $ref: '#/components/schemas/Categories'
	 */
	router.get("/", authenticate, categoriesController.getAllCategories);

	/**
	 * @openapi
	 *    /api/v1/categories:
	 *        post:
	 *            summary: Create a new category
	 *            description: Create a new category by providing its name and optional description.
	 *            tags:
	 *                - Categories
	 *            requestBody:
	 *                required: true
	 *                content:
	 *                    multipart/form-data:
	 *                        schema:
	 *                            $ref: '#/components/schemas/Categories'
	 *            responses:
	 *                201:
	 *                    description: Category created successfully
	 *                    content:
	 *                        application/json:
	 *                            schema:
	 *                                type: object
	 *                                properties:
	 *                                    status:
	 *                                        type: string
	 *                                        description: The response status
	 *                                        enum: [success]
	 *                                    data:
	 *                                        type: object
	 *                                        properties:
	 *                                            Categories:
	 *                                                $ref: '#/components/schemas/Categories'
	 *
	 */
	router.post("/", upload.none(), categoriesController.createCategory);

	/**
	 * @openapi
	 *  /api/v1/categories:
	 *      delete:
	 *          summary: Delete all categories
	 *          description: Delete all categories
	 *          tags:
	 *              - Categories
	 *          responses:
	 *              200:
	 *                  description: All categories deleted
	 *                  $ref: '#/components/responses/200NoData'
	 */

	router.delete("/", upload.none(), categoriesController.deleteAllCategories);
	router.all("/", methodNotAllowed);

	/**
	 *@openapi
	 *    /api/v1/categories/{id}:
	 *    get:
	 *        summary: Get category by ID
	 *        description: Retrieve a single category by its ID.
	 *        tags:
	 *            - Categories
	 *        parameters:
	 *            - in: path
	 *              name: id
	 *              required: true
	 *              schema:
	 *                type: integer
	 *              description: The ID of the category to retrieve
	 *        responses:
	 *            200:
	 *                description: The requested category
	 *                content:
	 *                    application/json:
	 *                        schema:
	 *                            type: object
	 *                            properties:
	 *                                status:
	 *                                    type: string
	 *                                    enum: [success]
	 *                                data:
	 *                                    $ref: '#/components/schemas/Categories'
	 */
	router.get("/:id", categoriesController.getCategoryById);

	/**
	 * @openapi
	 *    /api/v1/categories/{id}:
	 *        put:
	 *            summary: Update a category
	 *            description: Update a category's name and description by its ID.
	 *            tags:
	 *                - Categories
	 *            security:
	 *                - bearerAuth: []
	 *            parameters:
	 *                - in: path
	 *                  name: id
	 *                  required: true
	 *                  schema:
	 *                    type: integer
	 *                  description: The ID of the category to update
	 *            requestBody:
	 *                required: true
	 *                content:
	 *                    multipart/form-data:
	 *                        schema:
	 *                            $ref: '#/components/schemas/Categories'
	 *            responses:
	 *              200:
	 *                description: Category updated successfully
	 *                content:
	 *                    application/json:
	 *                        schema:
	 *                            type: object
	 *                            properties:
	 *                                status:
	 *                                    type: string
	 *                                    enum: [success]
	 *                                data:
	 *                                    type: object
	 *                                    properties:
	 *                                        category:
	 *                                            $ref: '#/components/schemas/Categories'
	 */
	router.put(
		"/:id",
		authenticate,
		upload.none(),
		categoriesController.updateCategory
	);
	/**
	 * @openapi
	 *  /api/v1/categories/{id}:
	 *    delete:
	 *      summary: Delete a category
	 *      description: Delete a category by its ID
	 *      tags:
	 *        - Categories
	 *      security:
	 *        - bearerAuth: []
	 *      parameters:
	 *        - in: path
	 *          name: id
	 *          required: true
	 *          schema:
	 *            type: integer
	 *          description: The ID of the category to delete
	 *      responses:
	 *        200:
	 *          description: Category deleted successfully
	 *          $ref: '#/components/responses/200NoData'
	 *
	 */
	router.delete("/:id", authenticate, categoriesController.deleteCategory);

	router.all("/:id", methodNotAllowed);
};
