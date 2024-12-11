const usersService = require("../services/users.service");
const ApiError = require("../api-error");
const JSend = require("../jsend");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function register(req, res, next) {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return next(new ApiError(400, "Fill all the field"));
	}

	try {
		const existingUser = await usersService.getUserByEmail(email);
		if (existingUser) {
			return next(new ApiError(400, "Email exist"));
		}
		const passwordString = String(password);
		const hashedPassword = await bcrypt.hash(passwordString, 10);

		const user = await usersService.createUser({
			name,
			email,
			password: hashedPassword,
		});
		return res.status(201).json(JSend.success({ user }));
	} catch (error) {
		console.log(error);
		return next(new ApiError(500, "An error occurred"));
	}
}

async function login(req, res, next) {
	const { email, password } = req.body;

	if (!email || !password) {
		return next(new ApiError(400, "Email and password need to be fill"));
	}

	try {
		const user = await usersService.getUserByEmail(email);
		if (!user) {
			return next(new ApiError(401, "Wrong email"));
		}

		const passwordString = String(password);
		const isMatch = await bcrypt.compare(
			passwordString,
			String(user.password)
		);
		if (isMatch) {
			const token = jwt.sign(
				{ id: user.id, email: user.email, name: user.name },
				process.env.JWT_SECRET,
				{
					expiresIn: "8h",
				}
			);

			return res.json(JSend.success({ token }));
		}

		return next(new ApiError(401, "Wrong password"));
	} catch (error) {
		console.log(error);
		return next(new ApiError(500, "An error occurred"));
	}
}

module.exports = {
	register,
	login,
};
