import { body } from "express-validator";

function registerValidation() {
	return [
		body("firstName").notEmpty().withMessage("First name is required").trim(),
		body("lastName").notEmpty().withMessage("Last name is required"),
		body("email")
			.isEmail()
			.withMessage("Invalid email address")
			.normalizeEmail(),
		body("password")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters long"),
	];
}

export { registerValidation };
