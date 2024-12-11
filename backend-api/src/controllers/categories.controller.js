const categoriesService = require("../services/categories.service");
const expenseService = require("../services/expense.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");

async function createCategory(req, res, next) {
	const { name, description } = req.body;

	// Kiểm tra xem trường name có tồn tại không và có phải là chuỗi hay không
	if (!name || typeof name !== "string") {
		return next(new ApiError(400, "Missing required field: name"));
	}

	try {
		// Gọi service để tạo category
		const newCategory = await categoriesService.createCategory({
			name,
			description,
		});

		// Trả về category mới tạo với trạng thái thành công
		return res.status(201).json(JSend.success({ newCategory }));
	} catch (error) {
		console.error(error);
		return next(new ApiError(500, "Database error"));
	}
}

async function getAllCategories(req, res, next) {
	try {
		// const categories = await categoriesService.getAllCategories();
		const categories = await expenseService.getUserCategories(req.user.id);
		res.status(200).json(JSend.success({ categories }));
	} catch (error) {
		next(new ApiError(500, "Error retrieving categories"));
	}
}

async function getCategoryById(req, res, next) {
	const { id } = req.params;
	try {
		const category = await categoriesService.getCategoryById(id);
		if (!category) {
			return next(new ApiError(404, "Category not found"));
		}
		res.status(200).json(JSend.success({ category }));
	} catch (error) {
		next(new ApiError(500, "Error retrieving category"));
	}
}

async function updateCategory(req, res, next) {
	const { name, description } = req.body;

	if (!name || !description) {
		return next(new ApiError(400, "Name and description cannot be empty"));
	}

	const { id } = req.params;
	const userId = req.user.id;

	try {
		const userHasCategory = await expenseService.checkUserCategory(
			userId,
			id
		);
		if (!userHasCategory) {
			return next(
				new ApiError(
					403,
					"You cannot update this category because your expenses not have this category"
				)
			);
		}

		const updatedCategory = await categoriesService.updateCategory(
			id,
			name,
			description
		);
		if (!updatedCategory) {
			return next(new ApiError(404, "Category not found"));
		}
		return res
			.status(200)
			.json(JSend.success({ category: updatedCategory }));
	} catch (error) {
		console.error(error);
		next(new ApiError(500, "Error updating category"));
	}
}

async function deleteCategory(req, res, next) {
	const { id } = req.params;
	const userId = req.user.id;

	try {
		const userHasCategory = await expenseService.checkUserCategory(
			userId,
			id
		);
		if (!userHasCategory) {
			return next(
				new ApiError(
					403,
					"You cannot delete this category because your expenses not have this category"
				)
			);
		}

		const deleted = await categoriesService.deleteCategory(id);
		if (!deleted) {
			return next(new ApiError(404, "Category not found"));
		}
		res.status(200).json(
			JSend.success({ message: "Category deleted successfully" })
		);
	} catch (error) {
		next(new ApiError(500, "Error deleting category"));
	}
}
async function deleteAllCategories(req, res, next) {
	try {
		// Gọi service để xóa tất cả các danh mục
		const result = await categoriesService.deleteAllCategories();

		// Trả về phản hồi thành công với message
		return res.status(200).json(JSend.success(result));
	} catch (error) {
		// Nếu có lỗi, trả về lỗi 500
		return next(new ApiError(500, "Error deleting all categories"));
	}
}

module.exports = {
	getAllCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	deleteAllCategories,
};
