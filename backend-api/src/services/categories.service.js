const knex = require("../database/knex");

async function getAllCategories() {
	return knex("categories").select("*");
}

async function getCategoryById(id) {
	return knex("categories").where({ id }).first();
}

async function createCategory({ name, description }) {
	// Thêm category mới vào cơ sở dữ liệu và lấy lại ID của category mới tạo
	const [id] = await knex("categories").insert({ name, description });

	// Trả về category mới tạo bằng cách lấy lại thông tin theo ID
	return getCategoryById(id);
}

async function updateCategory(id, name, description) {
	await knex("categories").where({ id }).update({ name, description });
	return getCategoryById(id);
}

async function deleteCategory(id) {
	return knex("categories").where({ id }).del();
}
async function deleteAllCategories() {
	// Xóa tất cả các danh mục trong bảng categories
	await knex("categories").del();
}
module.exports = {
	getAllCategories,
	getCategoryById,
	createCategory,
	updateCategory,
	deleteCategory,
	deleteAllCategories,
};
